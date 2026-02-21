import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import type { JwtPayload } from "../interfaces/JwtPayload";
// Eliminado: import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
// Las clases de error se acceden a través del objeto 'jwt' importado por defecto.

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Clase de utilidad para validar y decodificar tokens JWT.
 */
export class ValidateToken {

  /**
   * Verifica la autenticidad y validez de un token JWT.
   * @param token El token JWT a validar.
   * @returns El payload decodificado si es válido, o null si falla la validación.
   */
  static async validateTokenJWT(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      // Opcional: buscar el usuario en la DB para asegurarse de que aún existe
      return decoded;
    } catch (error) {
      // ----------------------------------------------------
      // MEJORA: Distinguir el tipo de error para una mejor depuración
      // ----------------------------------------------------
      // CORRECCIÓN: Acceder a las clases de error desde el objeto 'jwt'
      if (error instanceof jwt.TokenExpiredError) {
        console.error("Error de validación de token: El token ha expirado.");
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error(`Error de validación de token: Firma inválida o token mal formado. Detalle: ${error.message}`);
      } else {
        console.error("Error desconocido durante la validación del token:", error);
      }
      return null;
    }
  }
}