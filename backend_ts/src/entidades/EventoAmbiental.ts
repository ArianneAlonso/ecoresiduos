import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('eventos_ambientales')
export class EventoAmbiental extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'int', name: 'id_evento' })
    idEvento!: number;

    @Column({ type: 'text' })
    nombre!: string;

    @Column({ type: 'text', nullable: true })
    descripcion!: string | null;

    @Column({ type: 'timestamp without time zone' })
    fecha!: Date;

    @Column({ type: 'text', nullable: true })
    ubicacion!: string | null;

    @Column({ type: 'int', name: 'puntos_otorgados', nullable: true })
    puntosOtorgados!: number | null;

    // Columna para latitud (NUMERIC(9,6))
    @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
    latitud!: number | null;

    // Columna para longitud (NUMERIC(9,6))
    @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
    longitud!: number | null;

    // Relación Opcional con PuntoEcologico (si el evento ya generó la transacción de puntos)
    // Nota: La referencia es inversa y debe ser mapeada en la tabla de puntos.

}