import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { UserSession } from './types';
import prisma from './prisma';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET must be configured');
  return secret;
}

export function signJwtToken(payload: UserSession): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserSession;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<UserSession | null> {
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('jomrayz_token')?.value;
  }

  if (!token) return null;
  return verifyJwtToken(token);
}

export async function requireAdmin(req: NextRequest): Promise<UserSession | null> {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}
