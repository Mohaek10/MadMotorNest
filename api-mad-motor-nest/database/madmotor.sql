-- Adminer 4.8.1 PostgreSQL 12.2 dump

DROP TABLE IF EXISTS "categorias";
CREATE TABLE "public"."categorias" (
    "id" uuid NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_ccdf6cd1a34ea90a7233325063d" UNIQUE ("nombre")
) WITH (oids = false);

INSERT INTO "categorias" ("id", "nombre", "created_at", "updated_at", "is_deleted") VALUES
('bcfb0a0a-f370-4aa8-ab5f-5152c8334a66',	'BERLINA',	'2024-02-06 11:43:50.338558',	'2024-02-06 11:43:50.338558',	'f');

DROP TABLE IF EXISTS "clientes";
DROP SEQUENCE IF EXISTS clientes_id_seq;
CREATE SEQUENCE clientes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."clientes" (
    "id" bigint DEFAULT nextval('clientes_id_seq') NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "apellido" character varying(255) NOT NULL,
    "direccion" character varying(255) NOT NULL,
    "codigoPostal" integer DEFAULT '10000' NOT NULL,
    "dni" character varying(10) NOT NULL,
    "imagen" text DEFAULT 'https://via.placeholder.com/150' NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "pieza";
CREATE TABLE "public"."pieza" (
    "id" uuid NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "precio" numeric NOT NULL,
    "descripcion" character varying(100) NOT NULL,
    "cantidad" integer NOT NULL,
    "imagen" text DEFAULT 'https://i.imgur.com/5NkZ5rJ.png' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    CONSTRAINT "PK_d963ebe6b649d8425a5884ec6ce" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "pieza" ("id", "nombre", "precio", "descripcion", "cantidad", "imagen", "created_at", "updated_at", "is_deleted") VALUES
('a894b317-5ca2-4952-8417-856774001b71',	'Tuerca hexagonal',	1.5,	'Tuerca de acero inoxidable hexagonal, tamaño estándar.',	100,	'https://i.imgur.com/5NkZ5rJ.png',	'2024-02-06 11:54:41.679595',	'2024-02-06 11:54:41.679595',	'f');

DROP TABLE IF EXISTS "user_roles";
DROP SEQUENCE IF EXISTS user_roles_id_seq;
CREATE SEQUENCE user_roles_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 2 CACHE 1;

CREATE TABLE "public"."user_roles" (
    "id" integer DEFAULT nextval('user_roles_id_seq') NOT NULL,
    "role" character varying(50) DEFAULT 'USER' NOT NULL,
    "user_id" bigint,
    CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "user_roles" ("id", "role", "user_id") VALUES
(1,	'ADMIN',	1);

DROP TABLE IF EXISTS "usuarios";
DROP SEQUENCE IF EXISTS usuarios_id_seq;
CREATE SEQUENCE usuarios_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."usuarios" (
    "id" bigint DEFAULT nextval('usuarios_id_seq') NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "apellidos" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "username" character varying(255) NOT NULL,
    "password" character varying(255) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"),
    CONSTRAINT "UQ_9f78cfde576fc28f279e2b7a9cb" UNIQUE ("username")
) WITH (oids = false);

INSERT INTO "usuarios" ("id", "nombre", "apellidos", "email", "username", "password", "created_at", "updated_at", "is_deleted") VALUES
(1,	'mohamed',	'Ek EK',	'messi@email.com',	'mohaek10',	'$2a$12$dOXMtxgR0.lQWSlXfjkbO.iCTpQBhotxX5II8Hk1fpzhqQ4iX/NGa',	'2024-02-06 12:42:15.306',	'2024-02-06 12:42:15.306',	'f');

DROP TABLE IF EXISTS "vehiculos";
DROP SEQUENCE IF EXISTS vehiculos_id_seq;
CREATE SEQUENCE vehiculos_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."vehiculos" (
    "id" bigint DEFAULT nextval('vehiculos_id_seq') NOT NULL,
    "marca" character varying(100) NOT NULL,
    "modelo" character varying(100) NOT NULL,
    "year" character varying NOT NULL,
    "km" character varying NOT NULL,
    "precio" character varying NOT NULL,
    "stock" character varying NOT NULL,
    "image" character varying DEFAULT 'https://picsum.photos/200' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "categoria_id" uuid,
    CONSTRAINT "PK_bc0b75baae377e599cd46b502e1" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "vehiculos" ("id", "marca", "modelo", "year", "km", "precio", "stock", "image", "created_at", "updated_at", "isDeleted", "categoria_id") VALUES
(1,	'Ferrarri',	'Roma',	'2030',	'40000',	'999999',	'5',	'https://picsum.photos/200',	'2024-02-06 11:44:03.752047',	'2024-02-06 11:44:03.752047',	'f',	'bcfb0a0a-f370-4aa8-ab5f-5152c8334a66');

ALTER TABLE ONLY "public"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES usuarios(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."vehiculos" ADD CONSTRAINT "FK_2efc1b6ca8e8edb4a7e99e98464" FOREIGN KEY (categoria_id) REFERENCES categorias(id) NOT DEFERRABLE;

-- 2024-02-06 11:55:03.927527+00