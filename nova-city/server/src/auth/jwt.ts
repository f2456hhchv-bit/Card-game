import jwt from 'jsonwebtoken';

const SECRET = process.env.NOVA_CITY_JWT_SECRET ?? 'dev-secret-change-me';

if (!process.env.NOVA_CITY_JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn(
    '[nova-city] NOVA_CITY_JWT_SECRET is not set — using an insecure dev default. ' +
      'Set it before deploying anywhere beyond localhost.',
  );
}

export interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
