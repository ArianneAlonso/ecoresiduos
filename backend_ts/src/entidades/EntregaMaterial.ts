import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuarios";
import { Contenedor } from "./Contenedor";
import { Material } from "./Material";

export enum EstadoPuntos {
  PENDIENTE = "pendiente",
  CONFIRMADO = "confirmado",
  RECHAZADO = "rechazado",
}

@Entity("entregas_materiales")
export class EntregaMaterial {
  @PrimaryGeneratedColumn({ type: "int", name: "id_entrega" })
  idEntrega!: number;

  @Column({ name: "id_usuario", type: "int" })
  idUsuario!: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "id_usuario" })
  usuario!: Usuario;

  // Nuevos campos para la App Mobile
  @Column({ name: "detalle_materiales", type: "text", nullable: true })
  detalleMateriales?: string;

  @Column({ name: "tipo_envase", type: "varchar", length: 100, nullable: true })
  tipoEnvase?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  direccion?: string;

  @Column({
    name: "horario_preferencia",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  horarioPreferencia?: string;

  // Campos originales ajustados
  @Column({ name: "id_contenedor", type: "int", nullable: true })
  idContenedor?: number | null;

  @ManyToOne(() => Contenedor, { nullable: true })
  @JoinColumn({ name: "id_contenedor" })
  contenedor?: Contenedor;

  @Column({ name: "id_material", type: "int", nullable: true })
  idMaterial?: number;

  @ManyToOne(() => Material, { nullable: true })
  @JoinColumn({ name: "id_material" })
  material?: Material;

  @Column({
    type: "numeric",
    precision: 5,
    scale: 2,
    name: "peso_kg",
    default: 0,
  })
  pesoKg!: number;

  @Column({ type: "int", name: "puntos_ganados", default: 0 })
  puntosGanados!: number;

  @Column({
    type: "enum",
    enum: EstadoPuntos,
    default: EstadoPuntos.PENDIENTE,
    name: "estado_puntos",
  })
  estadoPuntos!: EstadoPuntos;

  @CreateDateColumn({ name: "fecha_solicitud" })
  fechaSolicitud!: Date;

  @Column({ name: "fecha_entrega", type: "timestamp", nullable: true })
  fechaEntrega?: Date;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  latitud?: number;

  @Column({ type: "numeric", precision: 10, scale: 7, nullable: true })
  longitud?: number;
}
