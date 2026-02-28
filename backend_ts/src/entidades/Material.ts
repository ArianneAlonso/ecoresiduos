// src/entidades/Material.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EntregaMaterial } from "./EntregaMaterial";

@Entity("materiales")
export class Material {
  @PrimaryGeneratedColumn({ type: "int", name: "id_material" })
  idMaterial!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  nombre!: string;

  // AÑADIDA: Coincide con la columna puntos_por_kg en la BD
  @Column({
    type: "numeric",
    precision: 5,
    scale: 2,
    name: "puntos_por_kg",
    default: 0,
  })
  puntosPorKg!: number;

  @OneToMany(() => EntregaMaterial, (entrega) => entrega.material)
  entregas!: EntregaMaterial[];
}
