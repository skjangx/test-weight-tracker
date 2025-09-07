import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/lib/database';
import { hashPassword, validatePassword, validateUsername } from '@/lib/password';
import { generateTokenPair } from '@/lib/jwt';
import { serialize } from 'cookie';
import type { SignupData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SignupData = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required',
      }, { status: 400 });
    }

    // Validate username format
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid username',
        details: usernameValidation.errors,
      }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors,
      }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Username already exists',
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await createUser(username, hashedPassword);
    if (!newUser) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create user',
      }, { status: 500 });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(newUser.id, newUser.username);

    // Set httpOnly cookies
    const accessTokenCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
      message: 'User created successfully',
    }, { status: 201 });

    // Set cookies
    response.headers.set('Set-Cookie', `${accessTokenCookie}, ${refreshTokenCookie}`);

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}