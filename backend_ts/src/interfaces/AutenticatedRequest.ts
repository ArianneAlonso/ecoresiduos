import type { Request } from 'express';
import type { JwtPayload } from './JwtPayload';

export type UserRole = 'administrador' | 'usuario' | 'operador';

export interface AuthenticatedRequest extends Request {
    // Definimos 'user' para que el desarrollador sepa qué esperar
    user?: JwtPayload;
}