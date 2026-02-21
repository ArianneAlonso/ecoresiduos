import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// NOTA: El enum TipoMaterialContenedor ya no se necesita
// si usas 'materiales_aceptados' como varchar/string en la BD.

@Entity("contenedores")
export class Contenedor extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_contenedor" })
  idContenedor!: number;

  @Column({
    type: "varchar",
    name: "nombre_identificador",
    unique: true,
    length: 100,
  })
  nombreIdentificador!: string;

  @Column({ type: "varchar", length: 200, name: "direccion" })
  direccion!: string;

  @Column({ type: "numeric", precision: 9, scale: 6, name: "latitud" })
  latitud!: number;

  @Column({ type: "numeric", precision: 9, scale: 6, name: "longitud" })
  longitud!: number; // --- COLUMNAS ACTUALIZADAS PARA COINCIDIR CON EL ESQUEMA SQL ---

  @Column({
    type: "varchar",
    length: 255,
    name: "materiales_aceptados",
  })
  materialesAceptados!: string; // Mapeado a 'materiales_aceptados' (varchar)

  @Column({
    type: "text",
    name: "dias_horarios_recoleccion",
    nullable: true, // Asegúrate de que este campo coincida con la nulabilidad en la BD
  })
  diasHorariosRecoleccion!: string; // Mapeado a 'dias_horarios_recoleccion' (text) // --- FIN DE COLUMNAS ACTUALIZADAS ---
}
