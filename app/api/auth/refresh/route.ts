import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokenPair } from '@/lib/jwt';
import { getUserById } from '@/lib/database';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'Refresh token not found',
      }, { status: 401 });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Invalid refresh token',
      }, { status: 401 });
    }

    // Verify user still exists
    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 401 });
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      user.id,
      user.username
    );

    // Set new httpOnly cookies
    const accessTokenCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', newRefreshToken, {
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
      message: 'Tokens refreshed successfully',
    });

    // Set new cookies
    response.headers.set('Set-Cookie', `${accessTokenCookie}, ${refreshTokenCookie}`);

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}