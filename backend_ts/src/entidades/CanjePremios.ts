import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Usuario } from './Usuarios'; 
import { Premio } from './Premios';   // <-- ¡Ahora esta importación será válida!

@Entity('canjes_premios')
export class CanjePremio extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id_canje' })
    idCanje!: number;

    // Relación N:1 con Usuario
    @Column({ name: 'id_usuario', type: 'int' }) 
    idUsuario!: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    // Relación N:1 con Premio
    @Column({ name: 'id_premio', type: 'int' }) 
    idPremio!: number;

    @ManyToOne(() => Premio)
    @JoinColumn({ name: 'id_premio' }) // FK a la nueva entidad Premio
    premio!: Premio;

    @Column({ type: 'int', name: 'puntos_utilizados' })
    puntosUtilizados!: number;

    @CreateDateColumn({ name: 'fecha_canje' })
    fechaCanje!: Date;

    @Column({ type: 'varchar', length: 50, default: 'pendiente' })
    estado!: string; 
}