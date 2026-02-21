-- Configuración inicial
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ----------------------------------------------------
-- 1. TIPOS ENUM
-- ----------------------------------------------------

CREATE TYPE public.tipo_transaccion_enum AS ENUM (
    'entrega',
    'evento',
    'canje'
);
ALTER TYPE public.tipo_transaccion_enum OWNER TO admin;

CREATE TYPE public.rol_enum AS ENUM (
    'usuario',
    'administrador',
    'operador'
);
ALTER TYPE public.rol_enum OWNER TO admin;

-- NUEVO ENUM: Estado para la confirmación diferida de puntos
CREATE TYPE public.estado_puntos_enum AS ENUM (
    'pendiente',
    'confirmado',
    'rechazado'
);
ALTER TYPE public.estado_puntos_enum OWNER TO admin;

-- ----------------------------------------------------
-- 2. TABLAS Y SECUENCIAS
-- ----------------------------------------------------

-- Tabla: materiales
CREATE TABLE public.materiales (
    id_material integer NOT NULL,
    nombre character varying(100) NOT NULL,
    puntos_por_kg numeric(5,2) DEFAULT 0 NOT NULL
);
ALTER TABLE public.materiales OWNER TO admin;
CREATE SEQUENCE public.materiales_id_material_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.materiales_id_material_seq OWNER TO admin;
ALTER SEQUENCE public.materiales_id_material_seq OWNED BY public.materiales.id_material;
ALTER TABLE ONLY public.materiales ALTER COLUMN id_material SET DEFAULT nextval('public.materiales_id_material_seq'::regclass);
ALTER TABLE ONLY public.materiales ADD CONSTRAINT materiales_pkey PRIMARY KEY (id_material);
ALTER TABLE ONLY public.materiales ADD CONSTRAINT materiales_nombre_key UNIQUE (nombre);

---

-- Tabla: usuarios
CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(50) NOT NULL,
    email character varying(80) NOT NULL,
    "contraseña" character varying(100) NOT NULL,
    rol public.rol_enum NOT NULL,
    puntos_acumulados integer DEFAULT 0 NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
); 
ALTER TABLE public.usuarios OWNER TO admin;
CREATE SEQUENCE public.usuarios_id_usuario_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO admin;
ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;
ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_email_key UNIQUE (email);

---

-- Tabla: contenedores
CREATE TABLE public.contenedores (
    id_contenedor integer NOT NULL,
    nombre_identificador character varying(100) NOT NULL UNIQUE DEFAULT 'Contenedor Genérico',
    direccion character varying(200),
    latitud numeric(9,6) NOT NULL,
    longitud numeric(9,6) NOT NULL,
    materiales_aceptados character varying(255) NOT NULL,
    dias_horarios_recoleccion text
);
ALTER TABLE public.contenedores OWNER TO admin;
CREATE SEQUENCE public.contenedores_id_contenedor_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.contenedores_id_contenedor_seq OWNER TO admin;
ALTER SEQUENCE public.contenedores_id_contenedor_seq OWNED BY public.contenedores.id_contenedor;
ALTER TABLE ONLY public.contenedores ALTER COLUMN id_contenedor SET DEFAULT nextval('public.contenedores_id_contenedor_seq'::regclass);
ALTER TABLE ONLY public.contenedores ADD CONSTRAINT contenedores_pkey PRIMARY KEY (id_contenedor);

---

-- Tabla: eventos_ambientales
CREATE TABLE public.eventos_ambientales (
    id_evento integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    fecha timestamp without time zone NOT NULL,
    ubicacion text,
    puntos_otorgados integer,
    latitud NUMERIC(9,6),
    longitud NUMERIC(9,6)
);
ALTER TABLE public.eventos_ambientales OWNER TO admin;
CREATE SEQUENCE public.eventos_ambientales_id_evento_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.eventos_ambientales_id_evento_seq OWNER TO admin;
ALTER SEQUENCE public.eventos_ambientales_id_evento_seq OWNED BY public.eventos_ambientales.id_evento;
ALTER TABLE ONLY public.eventos_ambientales ALTER COLUMN id_evento SET DEFAULT nextval('public.eventos_ambientales_id_evento_seq'::regclass);
ALTER TABLE ONLY public.eventos_ambientales ADD CONSTRAINT eventos_ambientales_pkey PRIMARY KEY (id_evento);

---

-- Tabla: premios
CREATE TABLE public.premios (
    id_premio integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    costo_puntos integer NOT NULL,
    stock integer DEFAULT 0
);
ALTER TABLE public.premios OWNER TO admin;
CREATE SEQUENCE public.premios_id_premio_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.premios_id_premio_seq OWNER TO admin;
ALTER SEQUENCE public.premios_id_premio_seq OWNED BY public.premios.id_premio;
ALTER TABLE ONLY public.premios ALTER COLUMN id_premio SET DEFAULT nextval('public.premios_id_premio_seq'::regclass);
ALTER TABLE ONLY public.premios ADD CONSTRAINT premios_pkey PRIMARY KEY (id_premio);

---

-- Tabla: entregas_materiales (CORREGIDA: AÑADIDA COLUMNA estado_puntos)
CREATE TABLE public.entregas_materiales (
    id_entrega integer NOT NULL,
    id_usuario integer NOT NULL,
    id_contenedor integer,
    id_material integer NOT NULL, 
    peso_kg numeric(5,2) NOT NULL,
    puntos_ganados integer NOT NULL,
    estado_puntos public.estado_puntos_enum DEFAULT 'pendiente' NOT NULL, 
    fecha_entrega timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    latitud NUMERIC(9,6) NULL, 
    longitud NUMERIC(9,6) NULL 
);
ALTER TABLE public.entregas_materiales OWNER TO admin;
CREATE SEQUENCE public.entregas_materiales_id_entrega_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.entregas_materiales_id_entrega_seq OWNED BY public.entregas_materiales.id_entrega;
ALTER TABLE ONLY public.entregas_materiales ALTER COLUMN id_entrega SET DEFAULT nextval('public.entregas_materiales_id_entrega_seq'::regclass);
ALTER TABLE ONLY public.entregas_materiales ADD CONSTRAINT entregas_materiales_pkey PRIMARY KEY (id_entrega);


---

-- Tabla: canjes_premios
CREATE TABLE public.canjes_premios (
    id_canje integer NOT NULL,
    id_usuario integer NOT NULL,
    id_premio integer NOT NULL,
    puntos_utilizados integer NOT NULL,
    fecha_canje timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(50) DEFAULT 'pendiente'
);
ALTER TABLE public.canjes_premios OWNER TO admin;
CREATE SEQUENCE public.canjes_premios_id_canje_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.canjes_premios_id_canje_seq OWNED BY public.canjes_premios.id_canje;
ALTER TABLE ONLY public.canjes_premios ALTER COLUMN id_canje SET DEFAULT nextval('public.canjes_premios_id_canje_seq'::regclass);
ALTER TABLE ONLY public.canjes_premios ADD CONSTRAINT canjes_premios_pkey PRIMARY KEY (id_canje);

---

-- Tabla: puntos_ecologicos
CREATE TABLE public.puntos_ecologicos (
    id_transaccion integer NOT NULL,
    id_usuario integer NOT NULL,
    tipo_transaccion public.tipo_transaccion_enum NOT NULL,
    puntos integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_referencia integer
);
ALTER TABLE public.puntos_ecologicos OWNER TO admin;
COMMENT ON COLUMN public.puntos_ecologicos.id_referencia IS 'ID de la tabla relacionada (ej. canje, evento, entrega)';
CREATE SEQUENCE public.puntos_ecologicos_id_transaccion_seq AS integer START WITH 1 INCREMENT BY 1 CACHE 1;
ALTER SEQUENCE public.puntos_ecologicos_id_transaccion_seq OWNER TO admin;
ALTER SEQUENCE public.puntos_ecologicos_id_transaccion_seq OWNED BY public.puntos_ecologicos.id_transaccion;
ALTER TABLE ONLY public.puntos_ecologicos ALTER COLUMN id_transaccion SET DEFAULT nextval('public.puntos_ecologicos_id_transaccion_seq'::regclass);
ALTER TABLE ONLY public.puntos_ecologicos ADD CONSTRAINT puntos_ecologicos_pkey PRIMARY KEY (id_transaccion);

-- ----------------------------------------------------
-- 3. CLAVES FORÁNEAS (RELACIONES)
-- ----------------------------------------------------

-- Relaciones de la tabla puntos_ecologicos
ALTER TABLE ONLY public.puntos_ecologicos
    ADD CONSTRAINT puntos_ecologicos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);

-- Relaciones de canjes_premios
ALTER TABLE ONLY public.canjes_premios
    ADD CONSTRAINT canjes_premios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);
ALTER TABLE ONLY public.canjes_premios
    ADD CONSTRAINT canjes_premios_id_premio_fkey FOREIGN KEY (id_premio) REFERENCES public.premios(id_premio);

-- Relaciones de entregas_materiales
ALTER TABLE ONLY public.entregas_materiales
    ADD CONSTRAINT entregas_materiales_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);
ALTER TABLE ONLY public.entregas_materiales
    ADD CONSTRAINT entregas_materiales_id_contenedor_fkey FOREIGN KEY (id_contenedor) REFERENCES public.contenedores(id_contenedor);
ALTER TABLE ONLY public.entregas_materiales
    ADD CONSTRAINT entregas_materiales_id_material_fkey FOREIGN KEY (id_material) REFERENCES public.materiales(id_material);
    
-- ----------------------------------------------------
-- 4. POBLACIÓN INICIAL DE DATOS
-- ----------------------------------------------------

INSERT INTO public.materiales (nombre, puntos_por_kg) VALUES
('Plástico', 5.00), -- 5 puntos por kg
('Papel', 3.50),    -- 3.5 puntos por kg
('Cartón', 4.00),
('Vidrio', 2.00),   -- 2 puntos por kg
('Metal', 10.00); -- 10 puntos por kg

-- Ejemplo de inserción de contenedor (asumiendo id_contenedor=1)
INSERT INTO public.contenedores (nombre_identificador, direccion, latitud, longitud, materiales_aceptados) VALUES
('Punto Azul Central', 'Calle Falsa 123', -34.6037, -58.3816, 'Plástico, Papel, Vidrio');