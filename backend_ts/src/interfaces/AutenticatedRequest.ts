import type { Request } from "express";
import type { JwtPayload } from "./JwtPayload";

export type UserRole = "administrador" | "usuario" | "operador";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
