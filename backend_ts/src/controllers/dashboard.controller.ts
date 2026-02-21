import type { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { EntregaMaterial } from '../entidades/EntregaMaterial';
import { Usuario } from '../entidades/Usuarios';
import { Contenedor } from '../entidades/Contenedor';
import { Repository } from 'typeorm';

export class DashboardController {
    
    private entregaRepository: Repository<EntregaMaterial>;
    private usuarioRepository: Repository<Usuario>;
    private contenedorRepository: Repository<Contenedor>;

    constructor() {
        this.entregaRepository = AppDataSource.getRepository(EntregaMaterial);
        this.usuarioRepository = AppDataSource.getRepository(Usuario);
        this.contenedorRepository = AppDataSource.getRepository(Contenedor);
    }

    public getKpis = async (req: Request, res: Response): Promise<void> => {
        try {
            // Obtener el inicio del mes actual y del mes anterior
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = startOfMonth; // El fin del mes anterior es el inicio del actual
            
            // --- CÁLCULOS ASÍNCRONOS ---
            
            // 1. Total de Usuarios Registrados
            const totalUsuarios = this.usuarioRepository.count();

            // 2. Total de Contenedores
            const totalContenedores = this.contenedorRepository.count();

            // 3. Kg Reciclados (Total Histórico)
            const totalKgRecicladosPromise = this.entregaRepository
                .createQueryBuilder("entrega")
                .select("SUM(entrega.pesoKg)", "sum")
                .getRawOne();
                
            // 4. Kg Reciclados (Este Mes)
            const kgRecicladosEsteMesPromise = this.entregaRepository
                .createQueryBuilder("entrega")
                .select("SUM(entrega.pesoKg)", "sum")
                .where("entrega.fechaEntrega >= :startOfMonth", { startOfMonth })
                .getRawOne();
                
            // 5. Kg Reciclados (Mes Anterior) - Para calcular la tendencia
            const kgRecicladosMesAnteriorPromise = this.entregaRepository
                .createQueryBuilder("entrega")
                .select("SUM(entrega.pesoKg)", "sum")
                .where("entrega.fechaEntrega >= :startOfLastMonth", { startOfLastMonth })
                .andWhere("entrega.fechaEntrega < :endOfLastMonth", { endOfLastMonth })
                .getRawOne();
                
            // 6. Usuarios Activos (Con al menos 1 entrega este mes)
            const usuariosActivosEsteMesPromise = this.entregaRepository
                .createQueryBuilder("entrega")
                .select("COUNT(DISTINCT entrega.usuario)", "count")
                .where("entrega.fechaEntrega >= :startOfMonth", { startOfMonth })
                .getRawOne();

            // Esperar todos los resultados de forma concurrente
            const [
                usuariosTotal, 
                contenedoresTotal, 
                kgTotal, 
                kgEsteMes,
                kgMesAnterior,
                usuariosActivosMes
            ] = await Promise.all([
                totalUsuarios, 
                totalContenedores, 
                totalKgRecicladosPromise, 
                kgRecicladosEsteMesPromise,
                kgRecicladosMesAnteriorPromise,
                usuariosActivosEsteMesPromise
            ]);
            
            // --- CONSOLIDACIÓN Y CÁLCULOS DERIVADOS ---

            const kgRecicladosValue = parseFloat(kgTotal?.sum || '0');
            const kgRecicladosMesValue = parseFloat(kgEsteMes?.sum || '0');
            const kgRecicladosMesAnteriorValue = parseFloat(kgMesAnterior?.sum || '0');
            const usuariosActivosValue = parseInt(usuariosActivosMes?.count || '0');
            
            // Cálculo de Tendencia y Participación
            const tendenciaKg = 
                kgRecicladosMesAnteriorValue > 0
                ? ((kgRecicladosMesValue - kgRecicladosMesAnteriorValue) / kgRecicladosMesAnteriorValue) * 100
                : (kgRecicladosMesValue > 0 ? 100 : 0); // Si el mes anterior es 0, la tendencia es 100% (si hay KGs este mes) o 0.

            const participacion = 
                usuariosTotal > 0
                ? (usuariosActivosValue / usuariosTotal) * 100
                : 0;
            
            // --- RESPUESTA ---

            res.status(200).json({
                metricas: {
                    usuariosTotal: usuariosTotal,
                    usuariosActivosMes: usuariosActivosValue,
                    participacionUsuarios: parseFloat(participacion.toFixed(1)), // Porcentaje
                    totalContenedores: contenedoresTotal,
                    
                    kgRecicladosTotal: parseFloat(kgRecicladosValue.toFixed(2)),
                    kgRecicladosEsteMes: parseFloat(kgRecicladosMesValue.toFixed(2)),
                    
                    // Tendencia: Crecimiento (%) vs Mes Anterior
                    tendenciaKgMes: parseFloat(tendenciaKg.toFixed(1)) 
                },
                charts: {
                    // Aquí se incluirán los datos de los gráficos (kgMensual, materialesRecolectados, etc.)
                }
            });

        } catch (error) {
            console.error("Error al obtener datos del dashboard:", error);
            res.status(500).json({ message: "Error interno al cargar el dashboard." });
        }
    };
}