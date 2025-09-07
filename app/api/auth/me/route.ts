import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { getUserById } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Access token not found',
      }, { status: 401 });
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Invalid access token',
      }, { status: 401 });
    }

    // Get user from database
    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}