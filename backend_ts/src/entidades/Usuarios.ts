import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { EntregaMaterial } from "./EntregaMaterial";
import { EventoAmbiental } from "./EventoAmbiental";

export enum UserRole {
  USUARIO = "usuario",
  ADMINISTRADOR = "administrador",
  OPERADOR = "operador",
}

@Entity("usuarios")
@Unique(["email"])
export class Usuario {
  @PrimaryGeneratedColumn({ type: "int", name: "id_usuario" })
  idUsuario!: number;

  @Column({ type: "varchar", length: 50 })
  nombre!: string;

  @Column({ type: "varchar", length: 50 })
  email!: string;

  @Column({ name: "contraseña", type: "varchar", length: 100, select: false })
  password!: string;

  @Column({ name: "direccion", type: "varchar", length: 200, nullable: true })
  direccion!: string;

  @Column({ name: "puntos_acumulados", type: "integer", default: 0 })
  puntosAcumulados!: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USUARIO,
  })
  rol!: UserRole;

  @CreateDateColumn({ name: "fecha_registro" })
  fechaRegistro!: Date;

  // ------------------------------------------------------------------
  // RELACIONES
  // ------------------------------------------------------------------

  // Un usuario puede tener muchas entregas de materiales
  @OneToMany(() => EntregaMaterial, (entrega) => entrega.usuario)
  entregas!: EntregaMaterial[];

  @ManyToMany(() => EventoAmbiental, (evento) => evento.usuarios)
  eventos!: EventoAmbiental[];
}
