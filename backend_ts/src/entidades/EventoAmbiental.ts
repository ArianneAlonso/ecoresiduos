import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Usuario } from "./Usuarios";

@Entity("eventos_ambientales")
export class EventoAmbiental extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_evento" })
  idEvento!: number;

  @Column({ type: "text" })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion!: string | null;

  @Column({ type: "timestamp without time zone" })
  fecha!: Date;

  @Column({ type: "numeric", precision: 9, scale: 6, name: "latitud" })
  latitud!: number;

  @Column({ type: "numeric", precision: 9, scale: 6, name: "longitud" })
  longitud!: number;

  @ManyToMany(() => Usuario, (usuario) => usuario.eventos)
  @JoinTable({
    name: "usuario_eventos", // Nombre de la tabla intermedia en la DB
    joinColumn: { name: "id_evento", referencedColumnName: "idEvento" },
    inverseJoinColumn: {
      name: "id_usuario",
      referencedColumnName: "idUsuario",
    },
  })
  usuarios!: Usuario[];
}
