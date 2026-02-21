// Define un tipo para los roles para garantizar la seguridad de tipos
export type UserRole = 'administrador' | 'usuario' | 'operador';

export interface JwtPayload {
    id: number; 
    email: string; 
    role: UserRole; 
}
