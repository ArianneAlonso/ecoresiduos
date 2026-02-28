import { DataSource } from 'typeorm';
import * as dotenv from "dotenv";
dotenv.config();

// 1. Importar TODAS las entidades
import { Usuario } from './entidades/Usuarios';
import { Contenedor } from './entidades/Contenedor';
import { EntregaMaterial } from './entidades/EntregaMaterial';
import { PuntoEcologico } from './entidades/PuntoEcologico';
import { Material } from './entidades/Material';
import { EventoAmbiental } from './entidades/EventoAmbiental';
import { Premio } from './entidades/Premios';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: false,
  logging: true, 
  
  // 2. Incluir TODAS las entidades en la lista
  entities: [
    Usuario, 
    Contenedor,
    EntregaMaterial,
    PuntoEcologico,
    Material,
    EventoAmbiental,
    Premio
  ],
});