import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../interfaces/AutenticatedRequest";
import type { UserRole } from "../interfaces/JwtPayload";

/**
 * Retorna un middleware que verifica si el usuario autenticado tiene un rol permitido.
 *
 * Este middleware asume que el SessionValidator se ejecutó previamente y estableció
 * la propiedad 'req.user'.
 *
 * @param allowedRoles Array de roles permitidos (ej. ['administrador', 'operador'])
 * @returns Un middleware de Express para la autorización.
 */
export const authorizeRole = (allowedRoles: UserRole[]) => {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Response | void => {
        // 1. Verificar Autenticación: Asegurarse de que SessionValidator haya establecido req.user.
        // Si no está, devolvemos 401 Unauthenticated, ya que la identidad es desconocida.
        if (!req.user) {
            console.warn(
                "AUTORIZACIÓN FALLIDA: Intentando autorizar sin un usuario autenticado (req.user no definido)."
            );
            return res
                .status(401) // 401 Unauthenticated - Autenticación Requerida
                .json({ message: "Autenticación requerida. Por favor, inicie sesión." });
        }

        const userRole = req.user.role;

        // 2. Verificar Autorización: Comprobar si el rol del usuario está permitido.
        if (allowedRoles.includes(userRole)) {
            // El usuario tiene el rol necesario.
            return next();
        } else {
            // El usuario está autenticado, pero el rol es insuficiente.
            console.log(
                `ACCESO DENEGADO (Rol): Usuario ID ${req.user.id} con rol '${userRole}' intentó acceder a una ruta solo para roles: [${allowedRoles.join(
                    ", "
                )}]`
            );
            return res.status(403).json({
                // 403 Forbidden - Acceso Prohibido por Rol Insuficiente
                message:
                    "Acceso prohibido. No tiene los permisos necesarios para acceder a este recurso.",
                requiredRoles: allowedRoles,
            });
        }
    };
};