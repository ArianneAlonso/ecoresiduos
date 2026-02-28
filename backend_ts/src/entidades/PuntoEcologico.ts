import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Usuario } from './Usuarios'; // Asume esta ruta

export enum EstadoPuntos {
    PENDIENTE = 'pendiente',
    CONFIRMADO = 'confirmado',
    RECHAZADO = 'rechazado',
}

export enum TipoTransaccion { 
    ENTREGA = 'entrega',
    EVENTO = 'evento',
    CANJE = 'canje',
}

@Entity('puntos_ecologicos')
export class PuntoEcologico extends BaseEntity {
    
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_transaccion' })
    idTransaccion!: number;

    // Relación N:1 con Usuario
    // CLAVE: Especificar el tipo 'int' (o el tipo de ID de tu Usuario)
    @Column({ name: 'id_usuario', type: 'int' }) 
    idUsuario!: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    @Column({ type: 'enum', enum: TipoTransaccion, name: 'tipo_transaccion' })
    tipoTransaccion!: TipoTransaccion;

    // CLAVE: Especificar el tipo 'int' para los puntos
    @Column({ type: 'int' })
    puntos!: number;

    @CreateDateColumn({ name: 'fecha' })
    fecha!: Date;

    // ID de la tabla de referencia (entrega, evento, o canje)
    // CLAVE: Especificar el tipo 'int' y nullable
    @Column({ name: 'id_referencia', type: 'int', nullable: true }) 
    idReferencia!: number | null;
}