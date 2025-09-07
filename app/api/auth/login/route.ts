import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/database';
import { verifyPassword } from '@/lib/password';
import { generateTokenPair } from '@/lib/jwt';
import { serialize } from 'cookie';
import type { LoginCredentials } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required',
      }, { status: 400 });
    }

    // Get user by username
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.username);

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
        id: user.id,
        username: user.username,
      },
      message: 'Login successful',
    });

    // Set cookies
    response.headers.set('Set-Cookie', `${accessTokenCookie}, ${refreshTokenCookie}`);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}