--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: plan_currency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_currency_enum AS ENUM (
    'bs',
    'usd',
    'usdt'
);


ALTER TYPE public.plan_currency_enum OWNER TO postgres;

--
-- Name: plan_interval_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_interval_enum AS ENUM (
    'month',
    'year'
);


ALTER TYPE public.plan_interval_enum OWNER TO postgres;

--
-- Name: property_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.property_estado_enum AS ENUM (
    'disponible',
    'reservado',
    'vendido',
    'alquilado',
    'anticretado',
    'inactivo'
);


ALTER TYPE public.property_estado_enum OWNER TO postgres;

--
-- Name: subscription_payment_state_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_payment_state_enum AS ENUM (
    'paid',
    'pending',
    'failed'
);


ALTER TYPE public.subscription_payment_state_enum OWNER TO postgres;

--
-- Name: user_gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_gender_enum AS ENUM (
    'masculino',
    'femenino',
    'otro'
);


ALTER TYPE public.user_gender_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ci integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying NOT NULL,
    phone character varying(15),
    is_active boolean DEFAULT true
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: imagen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imagen (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    url text NOT NULL,
    property_id uuid
);


ALTER TABLE public.imagen OWNER TO postgres;

--
-- Name: modalities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modalities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.modalities OWNER TO postgres;

--
-- Name: owner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owner (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ci character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.owner OWNER TO postgres;

--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_method (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.payment_method OWNER TO postgres;

--
-- Name: permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(70) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL
);


ALTER TABLE public.permission OWNER TO postgres;

--
-- Name: permission_rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission_rol (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    permission_id uuid,
    role_id uuid
);


ALTER TABLE public.permission_rol OWNER TO postgres;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(256) NOT NULL,
    unit_amount double precision NOT NULL,
    currency public.plan_currency_enum DEFAULT 'usdt'::public.plan_currency_enum NOT NULL,
    "interval" public.plan_interval_enum DEFAULT 'month'::public.plan_interval_enum NOT NULL,
    content_html json,
    is_active boolean DEFAULT true NOT NULL,
    amount_users integer,
    amount_properties integer,
    amount_sectors integer
);


ALTER TABLE public.plan OWNER TO postgres;

--
-- Name: property; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    descripcion text NOT NULL,
    precio numeric NOT NULL,
    estado public.property_estado_enum DEFAULT 'disponible'::public.property_estado_enum NOT NULL,
    area numeric NOT NULL,
    nro_habitaciones integer NOT NULL,
    nro_banos integer NOT NULL,
    nro_estacionamientos integer NOT NULL,
    user_id uuid,
    category_id uuid,
    modality_id uuid,
    sector_id uuid,
    ubicacion_id uuid,
    comision numeric DEFAULT 0.0 NOT NULL,
    condicion_compra text DEFAULT 'Sin condiciones especiales.'::text NOT NULL
);


ALTER TABLE public.property OWNER TO postgres;

--
-- Name: property_owner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_owner (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    property_id uuid,
    owner_id uuid
);


ALTER TABLE public.property_owner OWNER TO postgres;

--
-- Name: realstate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realstate (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    address character varying(100) NOT NULL
);


ALTER TABLE public.realstate OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(70) NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: sector; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sector (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    adress character varying(100),
    phone character varying(15),
    real_state_id uuid
);


ALTER TABLE public.sector OWNER TO postgres;

--
-- Name: subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    init_date character varying(100) NOT NULL,
    end_date character varying(100) NOT NULL,
    last_payment_date character varying(100) NOT NULL,
    next_payment_date character varying(100) NOT NULL,
    state character varying(100) DEFAULT 'active'::character varying NOT NULL,
    renewal boolean DEFAULT false NOT NULL,
    real_state_id uuid,
    plan_id uuid
);


ALTER TABLE public.subscription OWNER TO postgres;

--
-- Name: subscription_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_payment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_date character varying(100) NOT NULL,
    amount double precision NOT NULL,
    state public.subscription_payment_state_enum DEFAULT 'paid'::public.subscription_payment_state_enum NOT NULL,
    subscription_id uuid,
    payment_method_id uuid
);


ALTER TABLE public.subscription_payment OWNER TO postgres;

--
-- Name: ubicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ubicacion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    direccion character varying NOT NULL,
    pais character varying NOT NULL,
    ciudad character varying NOT NULL,
    latitud numeric(10,7) NOT NULL,
    longitud numeric(10,7) NOT NULL
);


ALTER TABLE public.ubicacion OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ci integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying NOT NULL,
    phone character varying(15),
    gender public.user_gender_enum DEFAULT 'otro'::public.user_gender_enum,
    is_active boolean DEFAULT true,
    role_id uuid,
    sector_id uuid
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, created_at, updated_at, name, is_active) FROM stdin;
a005b7b7-dec2-4d67-acda-eb3a08ce6ba5	2025-05-14 17:54:49.837144-04	2025-05-14 17:54:49.837144-04	Casa	t
0534c7c3-f7a6-417e-b30b-7719036051ea	2025-05-14 17:54:59.472888-04	2025-05-14 17:54:59.472888-04	departamento	t
25c072f4-f258-433e-99b0-12514022c35a	2025-05-14 17:55:10.776795-04	2025-05-14 17:55:10.776795-04	lote	t
9e8f3c41-2a1b-4dfe-86f5-de3da3f45b74	2025-05-14 18:10:44.019313-04	2025-05-14 18:10:44.019313-04	terreno	t
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, created_at, updated_at, ci, name, email, password, phone, is_active) FROM stdin;
\.


--
-- Data for Name: imagen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imagen (id, created_at, updated_at, url, property_id) FROM stdin;
b3a43ddb-846b-47cf-b13d-0a3ad802df40	2025-05-17 18:43:27.861292-04	2025-05-17 18:43:27.861292-04	https://sm.ign.com/t/ign_in/screenshot/default/dr-stone-science-future-feature_1yxw.1200.jpg	e8949f91-aa39-443d-9bcd-d6dc9a85405b
723e91ae-b600-406b-b0d3-1f5017dd4b2f	2025-05-17 18:43:27.861292-04	2025-05-17 18:43:27.861292-04	https://mfiles.alphacoders.com/995/995994.png	e8949f91-aa39-443d-9bcd-d6dc9a85405b
\.


--
-- Data for Name: modalities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modalities (id, created_at, updated_at, name) FROM stdin;
66eb1d15-d352-4573-b991-69dbde687a66	2025-05-14 17:56:22.829981-04	2025-05-14 17:56:22.829981-04	Venta
27c68526-dcbb-46e1-80fa-c630c82b1f18	2025-05-14 17:56:22.829981-04	2025-05-14 17:56:22.829981-04	Anticretico
8d666d37-4861-4009-84d0-e139fbc2990f	2025-05-14 17:56:22.829981-04	2025-05-14 17:56:22.829981-04	Alquiler
\.


--
-- Data for Name: owner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.owner (id, created_at, updated_at, ci, name, email, phone, is_active) FROM stdin;
32402a42-820a-419e-9a59-1d6c23693101	2025-05-17 18:25:49.420842-04	2025-05-17 18:25:49.420842-04	1112	nate river	nate@gmail.com	12345678	t
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method (id, created_at, updated_at, name) FROM stdin;
521fc8b4-841d-4f5d-a788-d1b2bf0b0235	2025-05-14 17:27:20.385186-04	2025-05-14 17:27:20.385186-04	cash
34c70ae0-b14b-4fb5-9e45-0f1e88ed09e8	2025-05-14 17:27:20.415767-04	2025-05-14 17:27:20.415767-04	credit_card
5b6f9e03-1f02-439a-bc3e-ddae28e2e20f	2025-05-14 17:27:20.437505-04	2025-05-14 17:27:20.437505-04	crypto
eb33d7b8-f27e-4045-9c1a-638753194add	2025-05-14 17:27:20.456634-04	2025-05-14 17:27:20.456634-04	qr_code
\.


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission (id, created_at, updated_at, name, description, type) FROM stdin;
564c8b31-2565-4f4e-a891-75b12d6bd157	2025-05-14 17:27:10.873767-04	2025-05-14 17:27:10.873767-04	Usuario	permite gestionar usuarios	Usuarios
44e3c953-0983-40fc-af28-634925c4c36b	2025-05-14 17:27:11.25737-04	2025-05-14 17:27:11.25737-04	Mostrar usuarios	permite ver usuarios	Usuarios
677f640f-2250-4748-8732-0c697f9eb46e	2025-05-14 17:27:11.288929-04	2025-05-14 17:27:11.288929-04	Rol	permite gestionar roles	Usuarios
0ad73f31-64a3-4261-8ef8-257b74a0a87b	2025-05-14 17:27:11.32412-04	2025-05-14 17:27:11.32412-04	Mostrar roles	permite ver roles	Usuarios
fa8be5bd-4cb2-4266-b232-b81adcc1ce85	2025-05-14 17:27:11.362351-04	2025-05-14 17:27:11.362351-04	Permiso	permite gestionar permisos	Usuarios
1a2db08e-4a5e-4b88-a1ca-14ebaab45187	2025-05-14 17:27:11.383344-04	2025-05-14 17:27:11.383344-04	Mostrar permisos	permite ver permisos	Usuarios
c51d5f1f-3241-42d4-b313-3a09349c88b9	2025-05-14 17:27:11.404908-04	2025-05-14 17:27:11.404908-04	Sector	permite gestionar sectores	Usuarios
986d2c37-1b5b-456f-9319-41bc666b515d	2025-05-14 17:27:11.422904-04	2025-05-14 17:27:11.422904-04	Mostrar sectores	permite ver sectores	Usuarios
7a95605a-af26-4f68-a59b-411e6b65545d	2025-05-14 17:27:11.441903-04	2025-05-14 17:27:11.441903-04	Crear sectores	permite crear sectores	Usuarios
1083b9a7-c13c-4d0d-bcf1-443679d13b65	2025-05-14 17:27:11.473365-04	2025-05-14 17:27:11.473365-04	Actualizar sectores	permite actualizar sectores	Usuarios
4c66aef4-ae78-45c1-aaeb-511dd89dda88	2025-05-14 17:27:11.78002-04	2025-05-14 17:27:11.78002-04	Inmobiliaria	permite gestionar inmobiliarias	Usuarios
6f39deb0-b3ec-4b65-bd2a-c99a09bed3b4	2025-05-14 17:27:11.804785-04	2025-05-14 17:27:11.804785-04	Mostrar inmobiliarias	permite ver inmobiliarias	Usuarios
b483e412-646f-40e1-be99-50d51a3838bb	2025-05-14 17:27:11.822799-04	2025-05-14 17:27:11.822799-04	Crear inmobiliarias	permite crear inmobiliarias	Usuarios
a50d2a90-46d1-4998-8dc0-3dd9362f330a	2025-05-14 17:27:11.844836-04	2025-05-14 17:27:11.844836-04	Actualizar inmobiliarias	permite actualizar inmobiliarias	Usuarios
9af87b4d-5a13-4ecc-bceb-4260b479747a	2025-05-14 17:27:11.873264-04	2025-05-14 17:27:11.873264-04	Eliminar inmobiliarias	permite eliminar inmobiliarias	Usuarios
fc13604c-8711-4bab-b953-c1b5756743fd	2025-05-14 17:27:11.890679-04	2025-05-14 17:27:11.890679-04	Suscripcion	permite gestionar suscripciones	Usuarios
c68c60ba-2e3d-45e9-9151-407faad17483	2025-05-14 17:27:11.907866-04	2025-05-14 17:27:11.907866-04	Propietario	permite gestionar propietarios	Usuarios
8b294b67-d6eb-4b30-87dc-fbbca14f509a	2025-05-14 17:27:11.926609-04	2025-05-14 17:27:11.926609-04	Mostrar propietarios	permite ver propietarios	Usuarios
01a1cc25-2c91-4e9d-867a-f128fe95630d	2025-05-14 17:27:11.955301-04	2025-05-14 17:27:11.955301-04	Crear propietarios	permite crear propietarios	Usuarios
b3fc6bca-d3ed-4d22-bf52-28565e3139f9	2025-05-14 17:27:12.274687-04	2025-05-14 17:27:12.274687-04	Actualizar propietarios	permite actualizar propietarios	Usuarios
924cdb6b-f031-42ef-9e0b-3ae45aa14d2d	2025-05-14 17:27:12.322917-04	2025-05-14 17:27:12.322917-04	Eliminar propietarios	permite eliminar propietarios	Usuarios
e06f4828-0c26-4cec-992c-bc8ad35d2232	2025-05-14 17:27:12.346476-04	2025-05-14 17:27:12.346476-04	Categoría	permite gestionar categorías	Usuarios
d45f83ce-d971-4284-b794-bbea999e2a4f	2025-05-14 17:27:12.372863-04	2025-05-14 17:27:12.372863-04	Mostrar categorías	permite ver categorías	Usuarios
20522d1e-430f-4737-912a-e43855f01529	2025-05-14 17:27:12.423225-04	2025-05-14 17:27:12.423225-04	Crear categorías	permite crear categorías	Usuarios
d22c1fc9-5cd3-411b-9778-2fe0ec788977	2025-05-14 17:27:12.447247-04	2025-05-14 17:27:12.447247-04	Actualizar categorías	permite actualizar categorías	Usuarios
9d933097-e963-4b74-8906-e80162ae5464	2025-05-14 17:27:12.521438-04	2025-05-14 17:27:12.521438-04	Eliminar categorías	permite eliminar categorías	Usuarios
e1535d1c-4965-429c-921e-915879ce1560	2025-05-14 17:27:12.541319-04	2025-05-14 17:27:12.541319-04	Modalidad	Permite gestionar modalidades	Usuarios
917b0071-d777-49da-bdd5-6d4f47c45b48	2025-05-14 17:27:12.623159-04	2025-05-14 17:27:12.623159-04	Mostrar modalidades	Permite ver modalidades	Usuarios
686fed9d-4a70-416e-a778-ae2b1384ecad	2025-05-14 17:27:12.673873-04	2025-05-14 17:27:12.673873-04	Crear modalidades	Permite crear modalidades	Usuarios
6abdf400-a867-4979-9b06-4f088d6e07e8	2025-05-14 17:27:12.703925-04	2025-05-14 17:27:12.703925-04	Actualizar modalidades	Permite actualizar modalidades	Usuarios
fe7d1e61-49ac-4994-a0db-9ade6dff799b	2025-05-14 17:27:12.734034-04	2025-05-14 17:27:12.734034-04	Eliminar modalidades	Permite eliminar modalidades	Usuarios
85a5bbd1-9f12-4bb5-8827-73f53b738369	2025-05-14 17:27:12.790393-04	2025-05-14 17:27:12.790393-04	Bitacora	Permite gestionar bitácora	Usuarios
3793547d-8f61-4ca8-8c27-1989c73264d8	2025-05-14 17:27:12.821631-04	2025-05-14 17:27:12.821631-04	Mostrar bitacora	Permite ver bitácora	Usuarios
\.


--
-- Data for Name: permission_rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_rol (id, created_at, updated_at, permission_id, role_id) FROM stdin;
db3928cc-103b-49cc-82e6-4e708f880c10	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	4c66aef4-ae78-45c1-aaeb-511dd89dda88	d600fa3d-9718-40a4-9d47-995a1710325c
c4a28002-54da-49c9-8e9e-4f4ac035a860	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	6f39deb0-b3ec-4b65-bd2a-c99a09bed3b4	d600fa3d-9718-40a4-9d47-995a1710325c
4f329226-dd2a-4be4-81bc-d296bf56729c	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	b483e412-646f-40e1-be99-50d51a3838bb	d600fa3d-9718-40a4-9d47-995a1710325c
99b9845d-00f5-4c77-8300-d6209e451cce	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	a50d2a90-46d1-4998-8dc0-3dd9362f330a	d600fa3d-9718-40a4-9d47-995a1710325c
08f89ffd-d066-4f08-ac65-0494d54d6a20	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	9af87b4d-5a13-4ecc-bceb-4260b479747a	d600fa3d-9718-40a4-9d47-995a1710325c
9b3dba43-7696-4f1a-98cf-e3d1840a26f1	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	85a5bbd1-9f12-4bb5-8827-73f53b738369	d600fa3d-9718-40a4-9d47-995a1710325c
035e4b94-1ce1-4c7d-818f-4d55fd2eab62	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	3793547d-8f61-4ca8-8c27-1989c73264d8	d600fa3d-9718-40a4-9d47-995a1710325c
80be3be1-e3a2-4204-8d6e-5aa39f8434ff	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	564c8b31-2565-4f4e-a891-75b12d6bd157	9c1365dc-8444-417b-b81c-4084949f0471
7aca0ddb-8d86-4ede-ab4e-1980b4cac0a7	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	44e3c953-0983-40fc-af28-634925c4c36b	9c1365dc-8444-417b-b81c-4084949f0471
1f642825-d218-477d-b3e0-b37b219ead0b	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	677f640f-2250-4748-8732-0c697f9eb46e	9c1365dc-8444-417b-b81c-4084949f0471
fa81abdf-4230-4377-814a-d5e142437663	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	0ad73f31-64a3-4261-8ef8-257b74a0a87b	9c1365dc-8444-417b-b81c-4084949f0471
c963a744-d141-482d-b64b-ae3713e70b94	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	1a2db08e-4a5e-4b88-a1ca-14ebaab45187	9c1365dc-8444-417b-b81c-4084949f0471
4fa878d3-42fc-4bc3-bf88-da050e8f191c	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	c51d5f1f-3241-42d4-b313-3a09349c88b9	9c1365dc-8444-417b-b81c-4084949f0471
e1c251d0-c87c-4c87-acf6-78641c8225d3	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	986d2c37-1b5b-456f-9319-41bc666b515d	9c1365dc-8444-417b-b81c-4084949f0471
d290e64b-f8e0-4eac-afd5-9fc06cfa244c	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	7a95605a-af26-4f68-a59b-411e6b65545d	9c1365dc-8444-417b-b81c-4084949f0471
955bb8f7-355a-4983-af53-f88479cd6a31	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	1083b9a7-c13c-4d0d-bcf1-443679d13b65	9c1365dc-8444-417b-b81c-4084949f0471
52f35769-3d50-4c16-86d9-2575a6044ce8	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	4c66aef4-ae78-45c1-aaeb-511dd89dda88	9c1365dc-8444-417b-b81c-4084949f0471
b29b3aa1-9747-45d3-81c7-1891b7bfbbfa	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	6f39deb0-b3ec-4b65-bd2a-c99a09bed3b4	9c1365dc-8444-417b-b81c-4084949f0471
4032d8d3-153c-4f56-b96a-b7c132b23c2d	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	b483e412-646f-40e1-be99-50d51a3838bb	9c1365dc-8444-417b-b81c-4084949f0471
870e41d5-ae35-4b76-a952-bf4cef94809c	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	a50d2a90-46d1-4998-8dc0-3dd9362f330a	9c1365dc-8444-417b-b81c-4084949f0471
4962b436-2fc0-4ed7-9046-8ce18346ffa7	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	9af87b4d-5a13-4ecc-bceb-4260b479747a	9c1365dc-8444-417b-b81c-4084949f0471
d524ef0a-6590-4b75-b490-556e202b5cc2	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	fc13604c-8711-4bab-b953-c1b5756743fd	9c1365dc-8444-417b-b81c-4084949f0471
b9b03816-3593-4a53-8a42-379852478bca	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	c68c60ba-2e3d-45e9-9151-407faad17483	9c1365dc-8444-417b-b81c-4084949f0471
6f3041c1-2a3e-4529-93b2-c100445ab168	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	8b294b67-d6eb-4b30-87dc-fbbca14f509a	9c1365dc-8444-417b-b81c-4084949f0471
99d9acf6-400c-4501-8620-823f0e4e74ff	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	01a1cc25-2c91-4e9d-867a-f128fe95630d	9c1365dc-8444-417b-b81c-4084949f0471
b47debc4-16a4-4afb-837c-153fb6d8de90	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	b3fc6bca-d3ed-4d22-bf52-28565e3139f9	9c1365dc-8444-417b-b81c-4084949f0471
a8481a74-1be4-4b2b-bc33-6940078a6f9a	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	924cdb6b-f031-42ef-9e0b-3ae45aa14d2d	9c1365dc-8444-417b-b81c-4084949f0471
41d485aa-cdb4-4bcb-8ee9-fc34156f539e	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	e06f4828-0c26-4cec-992c-bc8ad35d2232	9c1365dc-8444-417b-b81c-4084949f0471
2b6ab610-5fea-46ca-a985-c6ffadee0b45	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	d45f83ce-d971-4284-b794-bbea999e2a4f	9c1365dc-8444-417b-b81c-4084949f0471
b97092cb-a521-4fce-89d0-098b7c42d3b6	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	20522d1e-430f-4737-912a-e43855f01529	9c1365dc-8444-417b-b81c-4084949f0471
d400883d-1b76-4682-abf3-919e0f8ca0ed	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	d22c1fc9-5cd3-411b-9778-2fe0ec788977	9c1365dc-8444-417b-b81c-4084949f0471
5f6727ad-6ec1-4211-be12-f74a403bae66	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	9d933097-e963-4b74-8906-e80162ae5464	9c1365dc-8444-417b-b81c-4084949f0471
6801be74-0ee9-49ed-80cb-5bab2df60259	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	e1535d1c-4965-429c-921e-915879ce1560	9c1365dc-8444-417b-b81c-4084949f0471
a126eeeb-4ea1-4e9e-a5bd-99992818e419	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	917b0071-d777-49da-bdd5-6d4f47c45b48	9c1365dc-8444-417b-b81c-4084949f0471
79f4e0e7-d215-4ec6-a13a-a6e1c09b1a91	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	686fed9d-4a70-416e-a778-ae2b1384ecad	9c1365dc-8444-417b-b81c-4084949f0471
6e929c8f-2d45-4d6e-8c97-c180a348bf07	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	6abdf400-a867-4979-9b06-4f088d6e07e8	9c1365dc-8444-417b-b81c-4084949f0471
674ca159-286f-4e80-863e-b5287f1f1f60	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	fe7d1e61-49ac-4994-a0db-9ade6dff799b	9c1365dc-8444-417b-b81c-4084949f0471
d280343a-c8b5-4deb-852f-d93e51cf889f	2025-05-14 17:52:50.5832-04	2025-05-14 17:52:50.5832-04	fc13604c-8711-4bab-b953-c1b5756743fd	fdaf2062-9c22-40b1-b452-818c2d88d966
\.


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan (id, created_at, updated_at, name, description, unit_amount, currency, "interval", content_html, is_active, amount_users, amount_properties, amount_sectors) FROM stdin;
2cc28765-49c1-471c-8097-27ea374eea9a	2025-05-14 17:27:20.288325-04	2025-05-14 17:27:20.288325-04	Básico	Hasta 50 propiedades, 2 usuarios, Dashboard básico, Soporte por email	0.5	usdt	month	"[\\"1 agente\\",\\"1 sectores\\",\\"Hasta 20 inmuebles\\",\\"Dashboard básico\\",\\"Soporte por email\\"]"	t	1	20	1
7c297916-dbfe-469a-871e-297aead5f742	2025-05-14 17:27:20.31832-04	2025-05-14 17:27:20.31832-04	Profesional	Hasta 200 propiedades, 5 usuarios, Dashboard avanzado, Reportes básicos, Soporte prioritario	1	usdt	month	"[\\"5 agentes\\",\\"3 sectores\\",\\"Hasta 100 inmuebles\\",\\"Dashboard avanzado\\",\\"Soporte por email\\",\\"Reportes básicos\\"]"	t	5	100	3
c8428f05-0570-4953-a52c-9a7109f4892e	2025-05-14 17:27:20.339867-04	2025-05-14 17:27:20.339867-04	Empresarial	Propiedades ilimitadas, Usuarios ilimitados, Dashboard personalizado, Reportes avanzados, API access, Soporte 24/7	2	usdt	month	"[\\"20 agentes\\",\\"10 sectores\\",\\"Hasta 500 inmuebles\\",\\"Dashboard Profesional\\",\\"Soporte por email\\",\\"Reportes avanzados\\",\\"Soporte 24/7\\"]"	t	20	500	10
\.


--
-- Data for Name: property; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property (id, created_at, updated_at, descripcion, precio, estado, area, nro_habitaciones, nro_banos, nro_estacionamientos, user_id, category_id, modality_id, sector_id, ubicacion_id, comision, condicion_compra) FROM stdin;
e8949f91-aa39-443d-9bcd-d6dc9a85405b	2025-05-16 15:57:22.30937-04	2025-05-18 18:51:28.915809-04	Casa de 3 habitaciones y 2 baños en el centro de la ciudad	150000	reservado	250	3	2	1	9475a7c7-b3d9-416a-9fc9-0b50b47cfed0	a005b7b7-dec2-4d67-acda-eb3a08ce6ba5	66eb1d15-d352-4573-b991-69dbde687a66	8f21c7fc-5641-4728-bb80-bd5b919e3b0d	cb129188-d81a-414b-a51e-4048376e748c	0.15	no se aceptan mascotas, debe pagar en efectivo, precio debatible
\.


--
-- Data for Name: property_owner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_owner (id, created_at, updated_at, property_id, owner_id) FROM stdin;
7647e3dc-8ebc-4fbf-85ed-89a0d0bbb1aa	2025-05-17 18:31:04.366542-04	2025-05-17 18:31:04.366542-04	e8949f91-aa39-443d-9bcd-d6dc9a85405b	32402a42-820a-419e-9a59-1d6c23693101
\.


--
-- Data for Name: realstate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realstate (id, created_at, updated_at, name, email, address) FROM stdin;
190e9967-d927-4d0e-bc1a-51ab26540e37	2025-05-14 17:52:50.664069-04	2025-05-14 17:52:50.664069-04	nanamicorp	ryusui@gmail.com	
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, created_at, updated_at, name) FROM stdin;
d600fa3d-9718-40a4-9d47-995a1710325c	2025-05-14 17:27:12.851829-04	2025-05-14 17:27:12.851829-04	Administrador SU
9c1365dc-8444-417b-b81c-4084949f0471	2025-05-14 17:27:13.766377-04	2025-05-14 17:27:13.766377-04	Administrador TI
fdaf2062-9c22-40b1-b452-818c2d88d966	2025-05-14 17:52:50.5832-04	2025-05-14 17:52:50.5832-04	basic
\.


--
-- Data for Name: sector; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sector (id, created_at, updated_at, name, adress, phone, real_state_id) FROM stdin;
8f21c7fc-5641-4728-bb80-bd5b919e3b0d	2025-05-14 17:52:50.704661-04	2025-05-14 17:58:24.686524-04	nanamicorp	aldea ishigami	12345678	190e9967-d927-4d0e-bc1a-51ab26540e37
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription (id, created_at, updated_at, init_date, end_date, last_payment_date, next_payment_date, state, renewal, real_state_id, plan_id) FROM stdin;
773a8653-d411-4e5b-8dfe-b0b3fa0b8e77	2025-05-14 17:53:42.7435-04	2025-05-14 17:53:42.7435-04	14/05/2025 05:53 p. m.		14/05/2025 05:53 p. m.	2025-06-14T21:53:42.741Z	active	f	190e9967-d927-4d0e-bc1a-51ab26540e37	2cc28765-49c1-471c-8097-27ea374eea9a
\.


--
-- Data for Name: subscription_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_payment (id, created_at, updated_at, payment_date, amount, state, subscription_id, payment_method_id) FROM stdin;
de2f3b9d-6f54-400d-b07c-8f9d21e900fc	2025-05-14 17:53:42.822197-04	2025-05-14 17:53:42.822197-04	14/05/2025 05:53 p. m.	0.5	paid	773a8653-d411-4e5b-8dfe-b0b3fa0b8e77	5b6f9e03-1f02-439a-bc3e-ddae28e2e20f
\.


--
-- Data for Name: ubicacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ubicacion (id, created_at, updated_at, direccion, pais, ciudad, latitud, longitud) FROM stdin;
cb129188-d81a-414b-a51e-4048376e748c	2025-05-17 18:53:37.509057-04	2025-05-18 18:51:28.834176-04	Av. Principal 123, Barrio Centro	Bolivia	Santa Cruz	-16.5000000	-68.1500000
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, created_at, updated_at, ci, name, email, password, phone, gender, is_active, role_id, sector_id) FROM stdin;
0bce2849-c1b2-4158-8f41-d5737ce59e9c	2025-05-14 17:27:20.140107-04	2025-05-14 17:27:20.140107-04	12345678	Administrador SU	adminSU@gmail.com	$2b$10$RZuP4zYWY3YMTOYPP1JVY.oiEmnrjcFyRiG90EMP.LcN4VnKPMtLC	12345678	femenino	t	d600fa3d-9718-40a4-9d47-995a1710325c	\N
9475a7c7-b3d9-416a-9fc9-0b50b47cfed0	2025-05-14 17:52:51.201315-04	2025-05-14 17:53:42.956671-04	111	ryusui nanami	ryusui@gmail.com	$2b$10$r4RbfbM6Waga3wqSU0iptu/3qtH5BNqYO4ux2AOSP3VzqtEXdhoxK	12345678	masculino	t	9c1365dc-8444-417b-b81c-4084949f0471	8f21c7fc-5641-4728-bb80-bd5b919e3b0d
\.


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: property_owner PK_2541d2fb798d385a0521553370d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "PK_2541d2fb798d385a0521553370d" PRIMARY KEY (id);


--
-- Name: subscription_payment PK_25f8afce4159ee83cf8c6da622d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "PK_25f8afce4159ee83cf8c6da622d" PRIMARY KEY (id);


--
-- Name: permission_rol PK_3177c382bd83734f1cc0d789a92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "PK_3177c382bd83734f1cc0d789a92" PRIMARY KEY (id);


--
-- Name: permission PK_3b8b97af9d9d8807e41e6f48362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY (id);


--
-- Name: modalities PK_4135bf3c2e5bb971c20b08bbef1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modalities
    ADD CONSTRAINT "PK_4135bf3c2e5bb971c20b08bbef1" PRIMARY KEY (id);


--
-- Name: plan PK_54a2b686aed3b637654bf7ddbb3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY (id);


--
-- Name: sector PK_668b2ea8a2f534425407732f3ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT "PK_668b2ea8a2f534425407732f3ab" PRIMARY KEY (id);


--
-- Name: ubicacion PK_6ed79468fe4f565d8be642742a3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT "PK_6ed79468fe4f565d8be642742a3" PRIMARY KEY (id);


--
-- Name: payment_method PK_7744c2b2dd932c9cf42f2b9bc3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY (id);


--
-- Name: subscription PK_8c3e00ebd02103caa1174cd5d9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY (id);


--
-- Name: owner PK_8e86b6b9f94aece7d12d465dc0c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY (id);


--
-- Name: client PK_96da49381769303a6515a8785c7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY (id);


--
-- Name: realstate PK_98e1482af627189d667923cc906; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realstate
    ADD CONSTRAINT "PK_98e1482af627189d667923cc906" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: imagen PK_c9838d52bca36e9244bcb95bee6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT "PK_c9838d52bca36e9244bcb95bee6" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: property PK_d80743e6191258a5003d5843b4f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY (id);


--
-- Name: property REL_ee35ca44a21b2c3ac6f63373b0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "REL_ee35ca44a21b2c3ac6f63373b0" UNIQUE (ubicacion_id);


--
-- Name: user UQ_098e105d84a153cfa5d8306df98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_098e105d84a153cfa5d8306df98" UNIQUE (ci);


--
-- Name: permission UQ_240853a0c3353c25fb12434ad33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE (name);


--
-- Name: realstate UQ_48b01f015648c932089710d1a4e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realstate
    ADD CONSTRAINT "UQ_48b01f015648c932089710d1a4e" UNIQUE (email);


--
-- Name: owner UQ_5e6481e57aef4cd2b3a8339a476; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "UQ_5e6481e57aef4cd2b3a8339a476" UNIQUE (ci);


--
-- Name: payment_method UQ_6101666760258a840e115e1bb11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT "UQ_6101666760258a840e115e1bb11" UNIQUE (name);


--
-- Name: client UQ_6436cc6b79593760b9ef921ef12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE (email);


--
-- Name: owner UQ_7431bbd2e694ee4a80c32bd7ef8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "UQ_7431bbd2e694ee4a80c32bd7ef8" UNIQUE (email);


--
-- Name: role UQ_ae4578dcaed5adff96595e61660; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);


--
-- Name: client UQ_bf46f19067f5138aa6b8054da45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "UQ_bf46f19067f5138aa6b8054da45" UNIQUE (ci);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: permission_rol FK_0f88f52686ae64eaea0e2ffa752; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "FK_0f88f52686ae64eaea0e2ffa752" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: property_owner FK_333bdbeee5a1f17a5f70fb24d66; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "FK_333bdbeee5a1f17a5f70fb24d66" FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON DELETE CASCADE;


--
-- Name: subscription FK_5fde988e5d9b9a522d70ebec27c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c" FOREIGN KEY (plan_id) REFERENCES public.plan(id) ON DELETE CASCADE;


--
-- Name: property FK_723792fc2012f8a4c47915d1e25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_723792fc2012f8a4c47915d1e25" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: property FK_8b8dd7ba29b1834e5158ec4d4a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_8b8dd7ba29b1834e5158ec4d4a0" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: subscription FK_92949b15e6fe44bdafa7368cc77; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "FK_92949b15e6fe44bdafa7368cc77" FOREIGN KEY (real_state_id) REFERENCES public.realstate(id) ON DELETE CASCADE;


--
-- Name: subscription_payment FK_ad0ebe8b66ad9e06c8324a76591; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "FK_ad0ebe8b66ad9e06c8324a76591" FOREIGN KEY (subscription_id) REFERENCES public.subscription(id) ON DELETE CASCADE;


--
-- Name: imagen FK_afe9d7a110e1c9035075cbd50ab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT "FK_afe9d7a110e1c9035075cbd50ab" FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- Name: sector FK_b81921128bd54ad0b068e717f30; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT "FK_b81921128bd54ad0b068e717f30" FOREIGN KEY (real_state_id) REFERENCES public.realstate(id) ON DELETE CASCADE;


--
-- Name: user FK_bda5a4115efba8b39ce5de164ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_bda5a4115efba8b39ce5de164ee" FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE CASCADE;


--
-- Name: property_owner FK_c0a0fe356fc308a185fbda2c3bd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "FK_c0a0fe356fc308a185fbda2c3bd" FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: property FK_ce47de03834f0620de39774ed8a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_ce47de03834f0620de39774ed8a" FOREIGN KEY (modality_id) REFERENCES public.modalities(id) ON DELETE CASCADE;


--
-- Name: permission_rol FK_ce4d00b44009802ca244e4accb4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "FK_ce4d00b44009802ca244e4accb4" FOREIGN KEY (permission_id) REFERENCES public.permission(id);


--
-- Name: subscription_payment FK_ce8a06519352654346c3376529b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "FK_ce8a06519352654346c3376529b" FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id) ON DELETE CASCADE;


--
-- Name: property FK_d7856cf056ab52753be88383142; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_d7856cf056ab52753be88383142" FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE CASCADE;


--
-- Name: property FK_ee35ca44a21b2c3ac6f63373b05; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_ee35ca44a21b2c3ac6f63373b05" FOREIGN KEY (ubicacion_id) REFERENCES public.ubicacion(id) ON DELETE CASCADE;


--
-- Name: user FK_fb2e442d14add3cefbdf33c4561; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

