import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('premios')
export class Premio extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id_premio' })
    idPremio!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'text', nullable: true })
    descripcion!: string | null;

    @Column({ type: 'int', name: 'costo_puntos' })
    costoPuntos!: number;

    @Column({ type: 'int', default: 0 })
    stock!: number;

    // Nota: Aquí se podrían agregar relaciones One-to-Many para 
    // listar todos los CanjesPremios que usan este premio, si fuera necesario.
}