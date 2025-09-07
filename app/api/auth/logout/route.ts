import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  try {
    // Clear both access and refresh tokens by setting them to expired
    const accessTokenCookie = serialize('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Expire immediately
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Expire immediately
      path: '/',
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear cookies
    response.headers.set('Set-Cookie', `${accessTokenCookie}, ${refreshTokenCookie}`);

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}