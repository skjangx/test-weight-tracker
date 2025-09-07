import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './jwt';
import { getUserById } from './database';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    username: string;
  };
}

/**
 * Middleware to authenticate API requests
 * Returns the user if authenticated, null otherwise
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: AuthenticatedRequest['user']; error?: string }> {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return { user: undefined, error: 'Access token not found' };
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return { user: undefined, error: 'Invalid access token' };
    }

    // Get user from database to ensure they still exist
    const user = await getUserById(payload.userId);
    if (!user) {
      return { user: undefined, error: 'User not found' };
    }

    return {
      user: {
        id: user.id,
        username: user.username,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: undefined, error: 'Authentication failed' };
  }
}

/**
 * Higher-order function to protect API routes
 * Requires authentication and injects user into request
 */
export function withAuth<T extends unknown[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const { user, error } = await authenticateRequest(request);

    if (!user || error) {
      return NextResponse.json({
        success: false,
        error: error || 'Authentication required',
      }, { status: 401 });
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;

    return handler(authenticatedRequest, ...args);
  };
}

/**
 * Utility function to create unauthorized response
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 401 });
}

/**
 * Utility function to create forbidden response
 */
export function createForbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 403 });
}