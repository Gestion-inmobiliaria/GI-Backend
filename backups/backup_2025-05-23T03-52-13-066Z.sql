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
-- Name: plan_currency_enum; Type: TYPE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TYPE public.plan_currency_enum AS ENUM (
    'bs',
    'usd',
    'usdt'
);


ALTER TYPE public.plan_currency_enum OWNER TO inmobiliaria_owner;

--
-- Name: plan_interval_enum; Type: TYPE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TYPE public.plan_interval_enum AS ENUM (
    'month',
    'year'
);


ALTER TYPE public.plan_interval_enum OWNER TO inmobiliaria_owner;

--
-- Name: property_estado_enum; Type: TYPE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TYPE public.property_estado_enum AS ENUM (
    'disponible',
    'reservado',
    'vendido',
    'alquilado',
    'anticretado',
    'inactivo'
);


ALTER TYPE public.property_estado_enum OWNER TO inmobiliaria_owner;

--
-- Name: subscription_payment_state_enum; Type: TYPE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TYPE public.subscription_payment_state_enum AS ENUM (
    'paid',
    'pending',
    'failed'
);


ALTER TYPE public.subscription_payment_state_enum OWNER TO inmobiliaria_owner;

--
-- Name: user_gender_enum; Type: TYPE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TYPE public.user_gender_enum AS ENUM (
    'masculino',
    'femenino',
    'otro'
);


ALTER TYPE public.user_gender_enum OWNER TO inmobiliaria_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.categories OWNER TO inmobiliaria_owner;

--
-- Name: client; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.client OWNER TO inmobiliaria_owner;

--
-- Name: imagen; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.imagen (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    property_id uuid,
    url text
);


ALTER TABLE public.imagen OWNER TO inmobiliaria_owner;

--
-- Name: modalities; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.modalities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.modalities OWNER TO inmobiliaria_owner;

--
-- Name: owner; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.owner OWNER TO inmobiliaria_owner;

--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.payment_method (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.payment_method OWNER TO inmobiliaria_owner;

--
-- Name: permission; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.permission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(70) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL
);


ALTER TABLE public.permission OWNER TO inmobiliaria_owner;

--
-- Name: permission_rol; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.permission_rol (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    permission_id uuid,
    role_id uuid
);


ALTER TABLE public.permission_rol OWNER TO inmobiliaria_owner;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.plan OWNER TO inmobiliaria_owner;

--
-- Name: property; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.property OWNER TO inmobiliaria_owner;

--
-- Name: property_owner; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.property_owner (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    property_id uuid,
    owner_id uuid
);


ALTER TABLE public.property_owner OWNER TO inmobiliaria_owner;

--
-- Name: realstate; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.realstate (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    address character varying(100) NOT NULL
);


ALTER TABLE public.realstate OWNER TO inmobiliaria_owner;

--
-- Name: role; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
--

CREATE TABLE public.role (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(70) NOT NULL
);


ALTER TABLE public.role OWNER TO inmobiliaria_owner;

--
-- Name: sector; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.sector OWNER TO inmobiliaria_owner;

--
-- Name: subscription; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.subscription OWNER TO inmobiliaria_owner;

--
-- Name: subscription_payment; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.subscription_payment OWNER TO inmobiliaria_owner;

--
-- Name: ubicacion; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public.ubicacion OWNER TO inmobiliaria_owner;

--
-- Name: user; Type: TABLE; Schema: public; Owner: inmobiliaria_owner
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


ALTER TABLE public."user" OWNER TO inmobiliaria_owner;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.categories (id, created_at, updated_at, name, is_active) FROM stdin;
bfdaddc9-800d-46da-a623-0c8a2144ac99	2025-05-08 03:58:17.084302+00	2025-05-08 03:58:17.084302+00	Departamento	t
84c100f1-57d0-4c3d-8403-6318d428bd23	2025-05-08 03:58:17.725289+00	2025-05-08 03:58:17.725289+00	Casa	t
ff04c2ee-ec1f-43ad-bb8f-2361b88a7cc5	2025-05-08 03:58:18.338116+00	2025-05-08 03:58:18.338116+00	Terreno	t
951a556c-05b9-4d06-9344-a4c6f08592a2	2025-05-08 12:32:18.749939+00	2025-05-08 12:32:18.749939+00	Finca	t
7c2b0dbc-d080-447a-9e56-71bb984349d9	2025-05-08 12:33:12.978115+00	2025-05-08 12:33:12.978115+00	Casa unifamiliar	t
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.client (id, created_at, updated_at, ci, name, email, password, phone, is_active) FROM stdin;
6a37cb6d-3eb0-45a5-8b56-232f78bac73f	2025-05-08 04:08:20.539926+00	2025-05-08 04:08:20.539926+00	1234567	juan	juan@gmail.com	$2b$10$XpiGZtivxHVxVmfxxrbBT.UIt/9GS3U12OeJp3QMCv/ueHpl92M9e	1234567	t
\.


--
-- Data for Name: imagen; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.imagen (id, created_at, updated_at, property_id, url) FROM stdin;
5c4e392e-ed69-44b2-b712-a19d3976b851	2025-05-08 03:59:04.703717+00	2025-05-08 03:59:04.703717+00	7cb567e5-07d1-4963-a0ee-3e12a0cc23a0	https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop
5f935aee-1aeb-4f10-ae75-d8c1e8c0ccfc	2025-05-08 03:58:40.321598+00	2025-05-08 03:58:40.321598+00	ee15c5e4-75fa-4ab7-8f5d-05ad3cc2658d	https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop
7a78f25b-1762-4487-a222-ec5af66f67ea	2025-05-08 03:59:18.894445+00	2025-05-08 03:59:18.894445+00	b32deb01-0ca4-440f-a523-f20294968477	https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&auto=format&fit=crop
7a96561a-68f2-4e23-b3b7-48c3d2f0d16e	2025-05-08 03:59:17.869178+00	2025-05-08 03:59:17.869178+00	b32deb01-0ca4-440f-a523-f20294968477	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop
80e6cd44-2cd4-48f3-952b-fc8a612ac2d4	2025-05-08 03:58:52.470119+00	2025-05-08 03:58:52.470119+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop
8fb258fa-da08-4ab1-a81a-7a57805cb466	2025-05-08 04:46:07.982232+00	2025-05-08 04:46:07.982232+00	1d10a9c7-9d77-42c9-af72-1a472789186a	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop
9853679d-f307-406e-896f-eeaaee8f865b	2025-05-08 07:01:16.151798+00	2025-05-08 07:01:16.151798+00	614f504a-619e-46e9-90de-a611684f2b9a	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop
9a7077db-2b01-445e-9b29-af04e994aa2c	2025-05-08 04:52:22.795569+00	2025-05-08 04:52:22.795569+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop
9f7b9229-8d82-4c9e-857e-8eb5dcb796ce	2025-05-08 03:59:25.408778+00	2025-05-08 03:59:25.408778+00	1d10a9c7-9d77-42c9-af72-1a472789186a	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop
bf42991a-f922-4e76-b5f6-b22bd78aa7c3	2025-05-08 03:59:30.980399+00	2025-05-08 03:59:30.980399+00	745fcc28-31d8-4007-8636-1750501800c8	https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&auto=format&fit=crop
c1fce79d-816d-4b81-afeb-8fe3255fcab7	2025-05-08 03:59:12.310319+00	2025-05-08 03:59:12.310319+00	614f504a-619e-46e9-90de-a611684f2b9a	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop
c43090be-b1be-4c00-ad5c-2ee7c99a8816	2025-05-08 03:59:11.288025+00	2025-05-08 03:59:11.288025+00	614f504a-619e-46e9-90de-a611684f2b9a	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop
cb2dbc12-28fd-4d05-a645-95e8b959ca70	2025-05-08 03:59:06.777337+00	2025-05-08 03:59:06.777337+00	7cb567e5-07d1-4963-a0ee-3e12a0cc23a0	https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop
0a6841c9-28c7-420a-ae1a-3c0b07ae65ae	2025-05-20 11:46:12.709697+00	2025-05-20 11:46:12.709697+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://res.cloudinary.com/dvaydptqv/image/upload/v1747741570/inmuebles/vvopdjdwvocums5jyhan.jpg
cdee97e5-507e-4a3e-8bb3-c314d3d4791c	2025-05-20 11:46:12.709697+00	2025-05-20 11:46:12.709697+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=800&auto=format&fit=crop
0eb00b1c-19ab-4e6c-b3cb-22c223b24360	2025-05-08 03:59:26.430949+00	2025-05-08 03:59:26.430949+00	1d10a9c7-9d77-42c9-af72-1a472789186a	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop
0f763b7e-c8c7-4bfe-b650-2ab1d381c664	2025-05-08 03:58:39.296674+00	2025-05-08 03:58:39.296674+00	ee15c5e4-75fa-4ab7-8f5d-05ad3cc2658d	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop
13fb9111-fc5f-47fd-b5aa-95d45a25f3c3	2025-05-08 03:59:00.139073+00	2025-05-08 03:59:00.139073+00	367ee43b-7b4b-455d-a04a-bcb5f03b67d8	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop
1f576cb2-9e49-47c8-bed9-28a583ecc1fa	2025-05-08 03:59:36.469763+00	2025-05-08 03:59:36.469763+00	ebfc1b92-eb89-4544-a304-b6597aeebf1f	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop
2f13f825-eaf6-4bbd-b8f8-1c3e8a803703	2025-05-08 03:59:19.914236+00	2025-05-08 03:59:19.914236+00	b32deb01-0ca4-440f-a523-f20294968477	https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop
3cd1db37-5247-4c02-bdbd-983674fd5163	2025-05-08 03:58:47.967752+00	2025-05-08 03:58:47.967752+00	61e7adec-714d-42be-bede-8d0fb1aaa3ab	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop
3efab8d6-ba29-41e7-aae6-cbfd03e8484e	2025-05-08 03:58:41.361201+00	2025-05-08 03:58:41.361201+00	ee15c5e4-75fa-4ab7-8f5d-05ad3cc2658d	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop
429917b6-3ece-45a3-ad41-1dc3ca2268f0	2025-05-08 03:58:46.933208+00	2025-05-08 03:58:46.933208+00	61e7adec-714d-42be-bede-8d0fb1aaa3ab	https://images.unsplash.com/photo-1560448204-603b3fc33bd5?w=800&auto=format&fit=crop
493b18ba-3d3b-43f7-b38a-9dae8276567b	2025-05-20 11:46:12.709697+00	2025-05-20 11:46:12.709697+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop
4a81c2e9-740f-4f98-bd28-76e62c889dda	2025-05-08 03:59:24.384397+00	2025-05-08 03:59:24.384397+00	1d10a9c7-9d77-42c9-af72-1a472789186a	https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&auto=format&fit=crop
d39a40cf-8ae6-426b-afee-9b07d6e85a0f	2025-05-08 03:59:31.990948+00	2025-05-08 03:59:31.990948+00	745fcc28-31d8-4007-8636-1750501800c8	https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=800&auto=format&fit=crop
d3a73aa0-8f82-4039-b72f-2a92d43bb83e	2025-05-08 03:59:13.351056+00	2025-05-08 03:59:13.351056+00	614f504a-619e-46e9-90de-a611684f2b9a	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop
d50c1cf3-57fc-42b5-89e1-2346b120694f	2025-05-08 03:59:38.528639+00	2025-05-08 03:59:38.528639+00	ebfc1b92-eb89-4544-a304-b6597aeebf1f	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
d87f1b5b-4ead-43a9-913e-d665d7981fdc	2025-05-08 03:58:59.100504+00	2025-05-08 03:58:59.100504+00	367ee43b-7b4b-455d-a04a-bcb5f03b67d8	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
da461f5d-2ffa-489c-baed-23f0ed530ac4	2025-05-08 03:59:05.731667+00	2025-05-08 03:59:05.731667+00	7cb567e5-07d1-4963-a0ee-3e12a0cc23a0	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
dcf5b2a1-1f46-41e7-a8be-a841073ac976	2025-05-08 03:58:45.905529+00	2025-05-08 03:58:45.905529+00	61e7adec-714d-42be-bede-8d0fb1aaa3ab	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
e9100294-0d89-43ee-9b20-883a2ff31838	2025-05-08 07:19:46.91603+00	2025-05-08 07:19:46.91603+00	61e7adec-714d-42be-bede-8d0fb1aaa3ab	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
e9b496b4-26ef-401b-b201-4a0cf7b06c46	2025-05-08 03:59:37.50791+00	2025-05-08 03:59:37.50791+00	ebfc1b92-eb89-4544-a304-b6597aeebf1f	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
ea046690-579f-46a8-b356-f6880b1b7af1	2025-05-08 03:58:53.478467+00	2025-05-08 03:58:53.478467+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
ff1171e0-038a-4b0d-9d1a-d11c5f6b434e	2025-05-08 03:58:54.502605+00	2025-05-08 03:58:54.502605+00	047ad27f-9e15-4055-adf0-4b25bc169b25	https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop
\.


--
-- Data for Name: modalities; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.modalities (id, created_at, updated_at, name) FROM stdin;
42b545e5-3f37-4222-a7fa-8c9b18e56455	2025-05-08 03:58:19.142747+00	2025-05-08 03:58:19.142747+00	Venta
cc9a4734-01be-4772-bf6f-199130d17656	2025-05-08 03:58:19.745336+00	2025-05-08 03:58:19.745336+00	Alquiler
56565f8f-2ebd-444f-a1c8-64343965071f	2025-05-08 03:58:20.353769+00	2025-05-08 03:58:20.353769+00	Anticrético
\.


--
-- Data for Name: owner; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.owner (id, created_at, updated_at, ci, name, email, phone, is_active) FROM stdin;
38f71caa-8b30-41ef-ac3f-4520758c9717	2025-05-08 03:58:21.378156+00	2025-05-08 03:58:21.378156+00	5678123	Carlos Vargas	cvargas@gmail.com	76543210	t
aa1c78db-1edc-40a0-9d5a-42ff854547ee	2025-05-08 03:58:21.988127+00	2025-05-08 03:58:21.988127+00	7890123	María López	mlopez@gmail.com	70123456	t
7e08b464-f1ff-414e-9942-37febe0eace2	2025-05-08 03:58:22.597215+00	2025-05-08 03:58:22.597215+00	4567890	Roberto Mendoza	rmendoza@gmail.com	71234567	t
674aa0e3-1d8c-44ff-9e49-718ddfc2420a	2025-05-08 03:58:23.208175+00	2025-05-08 03:58:23.208175+00	3456789	Laura Suárez	lsuarez@gmail.com	73456789	t
3edc5a18-ca01-415e-9f2d-61553fd60d88	2025-05-08 03:58:23.816674+00	2025-05-08 03:58:23.816674+00	6789012	Jorge Flores	jflores@gmail.com	78901234	t
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.payment_method (id, created_at, updated_at, name) FROM stdin;
27677348-8a2d-44a7-9902-41e8f1fbc9b6	2025-05-08 03:58:14.440753+00	2025-05-08 03:58:14.440753+00	cash
53cffd4c-36db-4e73-852d-45e6f1d746be	2025-05-08 03:58:15.051262+00	2025-05-08 03:58:15.051262+00	credit_card
d45f9723-b4de-4c56-8fa8-1a6184c5a0db	2025-05-08 03:58:15.667808+00	2025-05-08 03:58:15.667808+00	crypto
89c098f0-8cf4-4c87-8128-ecd6aaf98c77	2025-05-08 03:58:16.275349+00	2025-05-08 03:58:16.275349+00	qr_code
\.


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.permission (id, created_at, updated_at, name, description, type) FROM stdin;
0a570390-7748-4672-9eb0-621c183f0807	2025-05-08 03:57:40.744473+00	2025-05-08 03:57:40.744473+00	Usuario	permite gestionar usuarios	Usuarios
a286939d-987a-495f-bbcb-6792e123fd5f	2025-05-08 03:57:41.358099+00	2025-05-08 03:57:41.358099+00	Mostrar usuarios	permite ver usuarios	Usuarios
ba5d8077-55ae-4de6-8c8b-db82b764a458	2025-05-08 03:57:41.998177+00	2025-05-08 03:57:41.998177+00	Rol	permite gestionar roles	Usuarios
5e276b30-fe49-4848-ac75-4c25ae04a273	2025-05-08 03:57:42.600059+00	2025-05-08 03:57:42.600059+00	Mostrar roles	permite ver roles	Usuarios
56f14758-0433-485a-9162-b8eb0db48092	2025-05-08 03:57:43.200785+00	2025-05-08 03:57:43.200785+00	Permiso	permite gestionar permisos	Usuarios
3eacb274-ea75-4156-b316-b1020eb74fa7	2025-05-08 03:57:43.823778+00	2025-05-08 03:57:43.823778+00	Mostrar permisos	permite ver permisos	Usuarios
128af7e2-f777-443d-9920-20a7890d01dc	2025-05-08 03:57:44.44486+00	2025-05-08 03:57:44.44486+00	Sector	permite gestionar sectores	Usuarios
a23a6a8d-8256-48fe-9660-6d21628d7211	2025-05-08 03:57:45.079828+00	2025-05-08 03:57:45.079828+00	Mostrar sectores	permite ver sectores	Usuarios
8934cd33-7693-4645-9e40-7c6aa36d08aa	2025-05-08 03:57:45.685812+00	2025-05-08 03:57:45.685812+00	Crear sectores	permite crear sectores	Usuarios
1f3b3a77-2629-4465-9ae7-24b310a994c6	2025-05-08 03:57:46.301011+00	2025-05-08 03:57:46.301011+00	Actualizar sectores	permite actualizar sectores	Usuarios
177533a2-ad6d-44b4-a5e2-c37373d26361	2025-05-08 03:57:46.912768+00	2025-05-08 03:57:46.912768+00	Inmobiliaria	permite gestionar inmobiliarias	Usuarios
77f085d9-5a98-4c42-b997-b32f2ce8c0ae	2025-05-08 03:57:47.536816+00	2025-05-08 03:57:47.536816+00	Mostrar inmobiliarias	permite ver inmobiliarias	Usuarios
ea231cd0-2c41-4d18-8e61-081aa71788a0	2025-05-08 03:57:48.136412+00	2025-05-08 03:57:48.136412+00	Crear inmobiliarias	permite crear inmobiliarias	Usuarios
fe671dcd-b732-4a2b-aea8-3c88715c8b6c	2025-05-08 03:57:48.789026+00	2025-05-08 03:57:48.789026+00	Actualizar inmobiliarias	permite actualizar inmobiliarias	Usuarios
f2c875fe-8d3b-4a91-977b-453f77c6c2bb	2025-05-08 03:57:49.411635+00	2025-05-08 03:57:49.411635+00	Eliminar inmobiliarias	permite eliminar inmobiliarias	Usuarios
67c39f72-e96d-4654-9f1a-b2e052210518	2025-05-08 03:57:50.011047+00	2025-05-08 03:57:50.011047+00	Suscripcion	permite gestionar suscripciones	Usuarios
3c556a10-167c-4e0d-8482-0b9ac9834dc6	2025-05-08 03:57:50.603235+00	2025-05-08 03:57:50.603235+00	Propietario	permite gestionar propietarios	Usuarios
1cf4fea1-ca3b-447d-8104-81279ad3bd72	2025-05-08 03:57:51.208712+00	2025-05-08 03:57:51.208712+00	Mostrar propietarios	permite ver propietarios	Usuarios
c17345ca-f6f5-4d4c-80b8-8cf2050ae5c1	2025-05-08 03:57:51.821241+00	2025-05-08 03:57:51.821241+00	Crear propietarios	permite crear propietarios	Usuarios
2adacb6b-815a-447d-920e-1f63fa118518	2025-05-08 03:57:52.429322+00	2025-05-08 03:57:52.429322+00	Actualizar propietarios	permite actualizar propietarios	Usuarios
b8230c3a-a2f5-4b53-bef6-ed56c7055d3f	2025-05-08 03:57:53.034475+00	2025-05-08 03:57:53.034475+00	Eliminar propietarios	permite eliminar propietarios	Usuarios
aff70bbb-edd0-46c5-ac3d-e30e32d50433	2025-05-08 03:57:53.647422+00	2025-05-08 03:57:53.647422+00	Categoría	permite gestionar categorías	Usuarios
4bf8d561-6dcd-4258-99c1-5ed96186ee53	2025-05-08 03:57:54.261339+00	2025-05-08 03:57:54.261339+00	Mostrar categorías	permite ver categorías	Usuarios
8f7642d9-c589-4c58-a673-5bd351adcde4	2025-05-08 03:57:54.885789+00	2025-05-08 03:57:54.885789+00	Crear categorías	permite crear categorías	Usuarios
7774b7be-d740-4131-b960-977d17dbeb8d	2025-05-08 03:57:55.488829+00	2025-05-08 03:57:55.488829+00	Actualizar categorías	permite actualizar categorías	Usuarios
4dfc31f9-7165-4e5d-b27a-9f5dd19c17fc	2025-05-08 03:57:56.104443+00	2025-05-08 03:57:56.104443+00	Eliminar categorías	permite eliminar categorías	Usuarios
0738d01a-579f-45bd-b6ea-efc14acdb8d2	2025-05-08 03:57:56.705304+00	2025-05-08 03:57:56.705304+00	Modalidad	Permite gestionar modalidades	Usuarios
13c33b41-664b-400b-b927-08c58cbed041	2025-05-08 03:57:57.294541+00	2025-05-08 03:57:57.294541+00	Mostrar modalidades	Permite ver modalidades	Usuarios
c318dfdb-6ccc-4ca5-a329-2b32545a7890	2025-05-08 03:57:57.905497+00	2025-05-08 03:57:57.905497+00	Crear modalidades	Permite crear modalidades	Usuarios
7b456e20-7f31-4e22-8702-2f3b53227fb0	2025-05-08 03:57:58.509254+00	2025-05-08 03:57:58.509254+00	Actualizar modalidades	Permite actualizar modalidades	Usuarios
56a7c000-46bc-49ea-be9b-f393150a7cb1	2025-05-08 03:57:59.129896+00	2025-05-08 03:57:59.129896+00	Eliminar modalidades	Permite eliminar modalidades	Usuarios
a4249e1d-d7e4-4b66-9e30-5e1a3069cb47	2025-05-08 03:57:59.728826+00	2025-05-08 03:57:59.728826+00	Bitacora	Permite gestionar bitácora	Usuarios
f627bd3b-da99-41c0-85fe-16a15cd54998	2025-05-08 03:58:00.345429+00	2025-05-08 03:58:00.345429+00	Mostrar bitacora	Permite ver bitácora	Usuarios
7ad6dd56-b9a8-4e0b-be2b-0ff9ea256a9d	2025-05-16 21:01:27.652175+00	2025-05-16 21:01:27.652175+00	Ver mapa	Permite visualizar el mapa con ubicaciones	USERS
\.


--
-- Data for Name: permission_rol; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.permission_rol (id, created_at, updated_at, permission_id, role_id) FROM stdin;
a0df1d44-6ca4-46a1-b1a1-88e911e7a961	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	177533a2-ad6d-44b4-a5e2-c37373d26361	8d85ef6b-79f9-44ae-8978-81621126b5d4
bee9cc38-efa1-48af-990f-0fc941e84cfc	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	77f085d9-5a98-4c42-b997-b32f2ce8c0ae	8d85ef6b-79f9-44ae-8978-81621126b5d4
26ffa5a8-c68e-455d-9c19-d6a56f362fcd	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	ea231cd0-2c41-4d18-8e61-081aa71788a0	8d85ef6b-79f9-44ae-8978-81621126b5d4
d2492588-baee-403d-ad64-d3dde4da4d94	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	fe671dcd-b732-4a2b-aea8-3c88715c8b6c	8d85ef6b-79f9-44ae-8978-81621126b5d4
2f8c77f9-10b9-42ce-bb72-0ab3a76c04bf	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	f2c875fe-8d3b-4a91-977b-453f77c6c2bb	8d85ef6b-79f9-44ae-8978-81621126b5d4
d86862ee-c45f-4753-abcb-4f55c6a2aebe	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	a4249e1d-d7e4-4b66-9e30-5e1a3069cb47	8d85ef6b-79f9-44ae-8978-81621126b5d4
03361904-447a-40e0-9aaf-3f545414f6cb	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	f627bd3b-da99-41c0-85fe-16a15cd54998	8d85ef6b-79f9-44ae-8978-81621126b5d4
fb00daf0-f171-4c19-8d32-0ab2a8e93bf2	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	0a570390-7748-4672-9eb0-621c183f0807	83dfa3e7-251a-4b4a-a490-77f7d3300541
82910236-b976-45f7-abf5-9d42cb5f06b0	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	a286939d-987a-495f-bbcb-6792e123fd5f	83dfa3e7-251a-4b4a-a490-77f7d3300541
a3d184e1-9324-46ff-8c58-8b30a87a1839	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	ba5d8077-55ae-4de6-8c8b-db82b764a458	83dfa3e7-251a-4b4a-a490-77f7d3300541
ca9f113d-880b-4359-a492-a5c43990b8e4	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	5e276b30-fe49-4848-ac75-4c25ae04a273	83dfa3e7-251a-4b4a-a490-77f7d3300541
1fe36518-db44-440a-a3be-f12808f118fd	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	3eacb274-ea75-4156-b316-b1020eb74fa7	83dfa3e7-251a-4b4a-a490-77f7d3300541
a3cbe790-e1c8-426d-b666-2cf3875f7d4d	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	128af7e2-f777-443d-9920-20a7890d01dc	83dfa3e7-251a-4b4a-a490-77f7d3300541
c2560266-40cf-43eb-9e78-dd250ce61f20	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	a23a6a8d-8256-48fe-9660-6d21628d7211	83dfa3e7-251a-4b4a-a490-77f7d3300541
d27de963-dbd8-4337-8ee1-d69c672ab587	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	8934cd33-7693-4645-9e40-7c6aa36d08aa	83dfa3e7-251a-4b4a-a490-77f7d3300541
a274fbf8-8c52-4088-a437-37dbc7aa279d	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	1f3b3a77-2629-4465-9ae7-24b310a994c6	83dfa3e7-251a-4b4a-a490-77f7d3300541
7402cc81-7c31-4fb6-a368-80b0c130b9bb	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	177533a2-ad6d-44b4-a5e2-c37373d26361	83dfa3e7-251a-4b4a-a490-77f7d3300541
a2b2d98f-c97f-42b4-9c0b-732284563d56	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	77f085d9-5a98-4c42-b997-b32f2ce8c0ae	83dfa3e7-251a-4b4a-a490-77f7d3300541
623d1b11-0365-4cc2-b1e3-e15ba2031297	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	ea231cd0-2c41-4d18-8e61-081aa71788a0	83dfa3e7-251a-4b4a-a490-77f7d3300541
dcb6a7ca-f1f9-41a1-8a46-1c310645f99b	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	fe671dcd-b732-4a2b-aea8-3c88715c8b6c	83dfa3e7-251a-4b4a-a490-77f7d3300541
0022cea7-02fb-440a-9606-99f3f1b1df5e	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	f2c875fe-8d3b-4a91-977b-453f77c6c2bb	83dfa3e7-251a-4b4a-a490-77f7d3300541
e9d76e77-a4db-4573-bead-85b9afa23600	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	67c39f72-e96d-4654-9f1a-b2e052210518	83dfa3e7-251a-4b4a-a490-77f7d3300541
1b77f763-b297-4320-ad45-42039934f52c	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	3c556a10-167c-4e0d-8482-0b9ac9834dc6	83dfa3e7-251a-4b4a-a490-77f7d3300541
815f1e2b-a66b-4504-8533-47c849e4c4b2	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	1cf4fea1-ca3b-447d-8104-81279ad3bd72	83dfa3e7-251a-4b4a-a490-77f7d3300541
d3ace775-c11a-4cc3-80c6-a97100576380	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	c17345ca-f6f5-4d4c-80b8-8cf2050ae5c1	83dfa3e7-251a-4b4a-a490-77f7d3300541
a72de267-fa17-40be-b09d-854d2bdaa55d	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	2adacb6b-815a-447d-920e-1f63fa118518	83dfa3e7-251a-4b4a-a490-77f7d3300541
82964133-9ddb-45f8-9279-4a64114730e1	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	b8230c3a-a2f5-4b53-bef6-ed56c7055d3f	83dfa3e7-251a-4b4a-a490-77f7d3300541
9fd582d6-fc45-482e-9b7c-bbab887459b5	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	aff70bbb-edd0-46c5-ac3d-e30e32d50433	83dfa3e7-251a-4b4a-a490-77f7d3300541
e3d584bb-61fe-4aaa-98e5-0862f1255b88	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	4bf8d561-6dcd-4258-99c1-5ed96186ee53	83dfa3e7-251a-4b4a-a490-77f7d3300541
cb6da77b-77a0-45b8-9721-9472ed43df8d	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	8f7642d9-c589-4c58-a673-5bd351adcde4	83dfa3e7-251a-4b4a-a490-77f7d3300541
d67544fc-57b7-48ab-bf99-796f0c9fbfbe	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	7774b7be-d740-4131-b960-977d17dbeb8d	83dfa3e7-251a-4b4a-a490-77f7d3300541
665732d7-f774-469d-9a60-f62955f2a43d	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	4dfc31f9-7165-4e5d-b27a-9f5dd19c17fc	83dfa3e7-251a-4b4a-a490-77f7d3300541
74c91004-8772-4715-a53d-38b45e3211a9	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	0738d01a-579f-45bd-b6ea-efc14acdb8d2	83dfa3e7-251a-4b4a-a490-77f7d3300541
9979016b-ed09-4799-a7ec-3fe506ca2ac6	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	13c33b41-664b-400b-b927-08c58cbed041	83dfa3e7-251a-4b4a-a490-77f7d3300541
a0f80eeb-aedb-44b8-a8d3-4533b357ab0c	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	c318dfdb-6ccc-4ca5-a329-2b32545a7890	83dfa3e7-251a-4b4a-a490-77f7d3300541
bd8603f3-31bd-4034-ab65-1260c716a7ca	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	7b456e20-7f31-4e22-8702-2f3b53227fb0	83dfa3e7-251a-4b4a-a490-77f7d3300541
002f3ee9-56cf-41dd-b02a-4c8268b2193b	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	56a7c000-46bc-49ea-be9b-f393150a7cb1	83dfa3e7-251a-4b4a-a490-77f7d3300541
f1c97ea1-157b-437c-9bdc-6fd4802a2231	2025-05-16 21:08:13.149168+00	2025-05-16 21:08:13.149168+00	7ad6dd56-b9a8-4e0b-be2b-0ff9ea256a9d	83dfa3e7-251a-4b4a-a490-77f7d3300541
\.


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.plan (id, created_at, updated_at, name, description, unit_amount, currency, "interval", content_html, is_active, amount_users, amount_properties, amount_sectors) FROM stdin;
733aaebb-508a-48ea-88dd-c6d5cdc47c72	2025-05-08 03:58:12.220752+00	2025-05-08 03:58:12.220752+00	Básico	Hasta 50 propiedades, 2 usuarios, Dashboard básico, Soporte por email	0.5	usdt	month	"[\\"1 agente\\",\\"1 sectores\\",\\"Hasta 20 inmuebles\\",\\"Dashboard básico\\",\\"Soporte por email\\"]"	t	1	20	1
aae59148-3275-4436-8a77-fffc8e28a0d9	2025-05-08 03:58:12.826692+00	2025-05-08 03:58:12.826692+00	Profesional	Hasta 200 propiedades, 5 usuarios, Dashboard avanzado, Reportes básicos, Soporte prioritario	1	usdt	month	"[\\"5 agentes\\",\\"3 sectores\\",\\"Hasta 100 inmuebles\\",\\"Dashboard avanzado\\",\\"Soporte por email\\",\\"Reportes básicos\\"]"	t	5	100	3
8f485a99-7e16-4d3d-a7a9-0c6f0feebd11	2025-05-08 03:58:13.433388+00	2025-05-08 03:58:13.433388+00	Empresarial	Propiedades ilimitadas, Usuarios ilimitados, Dashboard personalizado, Reportes avanzados, API access, Soporte 24/7	2	usdt	month	"[\\"20 agentes\\",\\"10 sectores\\",\\"Hasta 500 inmuebles\\",\\"Dashboard Profesional\\",\\"Soporte por email\\",\\"Reportes avanzados\\",\\"Soporte 24/7\\"]"	t	20	500	10
\.


--
-- Data for Name: property; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.property (id, created_at, updated_at, descripcion, precio, estado, area, nro_habitaciones, nro_banos, nro_estacionamientos, user_id, category_id, modality_id, sector_id, ubicacion_id, comision, condicion_compra) FROM stdin;
ee15c5e4-75fa-4ab7-8f5d-05ad3cc2658d	2025-05-08 03:58:37.226638+00	2025-05-08 03:58:37.226638+00	Amplio departamento de 3 habitaciones con vista panorámica a la ciudad.	95000	disponible	120	3	2	1	276e6956-de78-471b-9d27-daa96dfccdc3	bfdaddc9-800d-46da-a623-0c8a2144ac99	42b545e5-3f37-4222-a7fa-8c9b18e56455	78ff7d7c-a608-4f18-9907-4f8c8c82ef49	f6c287c0-56f5-4c0b-a03a-ef615848218e	0.0	Sin condiciones especiales.
61e7adec-714d-42be-bede-8d0fb1aaa3ab	2025-05-08 03:58:43.830544+00	2025-05-08 03:58:43.830544+00	Casa de 2 plantas con jardín amplio y piscina en zona residencial.	150000	disponible	250	4	3	2	276e6956-de78-471b-9d27-daa96dfccdc3	84c100f1-57d0-4c3d-8403-6318d428bd23	42b545e5-3f37-4222-a7fa-8c9b18e56455	78ff7d7c-a608-4f18-9907-4f8c8c82ef49	79c3af87-6ead-4f38-8a06-5e6e0d372000	0.0	Sin condiciones especiales.
047ad27f-9e15-4055-adf0-4b25bc169b25	2025-05-08 03:58:50.397355+00	2025-05-08 03:58:50.397355+00	Departamento de lujo en edificio exclusivo, con acabados de primera.	1200	disponible	95	2	2	1	276e6956-de78-471b-9d27-daa96dfccdc3	bfdaddc9-800d-46da-a623-0c8a2144ac99	cc9a4734-01be-4772-bf6f-199130d17656	efb48293-dcaa-4066-a11f-e56b1690c8bb	8b747aae-3774-4ed7-be9e-b5cab191a0c4	0.0	Sin condiciones especiales.
367ee43b-7b4b-455d-a04a-bcb5f03b67d8	2025-05-08 03:58:56.939439+00	2025-05-08 03:58:56.939439+00	Terreno de 500m² en zona de alto crecimiento, ideal para proyecto residencial.	75000	disponible	500	0	0	0	276e6956-de78-471b-9d27-daa96dfccdc3	ff04c2ee-ec1f-43ad-bb8f-2361b88a7cc5	42b545e5-3f37-4222-a7fa-8c9b18e56455	efb48293-dcaa-4066-a11f-e56b1690c8bb	38bb2ff1-9831-4d44-8036-7d548a8fe8b7	0.0	Sin condiciones especiales.
7cb567e5-07d1-4963-a0ee-3e12a0cc23a0	2025-05-08 03:59:02.642254+00	2025-05-08 03:59:02.642254+00	Casa antigua con potencial para remodelar, excelente ubicación.	85000	disponible	180	3	1	1	276e6956-de78-471b-9d27-daa96dfccdc3	84c100f1-57d0-4c3d-8403-6318d428bd23	56565f8f-2ebd-444f-a1c8-64343965071f	78ff7d7c-a608-4f18-9907-4f8c8c82ef49	82ed6f07-4b48-4d89-b165-5a33b25f98fd	0.0	Sin condiciones especiales.
614f504a-619e-46e9-90de-a611684f2b9a	2025-05-08 03:59:09.225348+00	2025-05-08 03:59:09.225348+00	Departamento moderno en zona exclusiva con amenidades de primer nivel.	110000	disponible	135	3	2	2	a16f033c-8f6c-415f-8f6b-7086af37b6bd	bfdaddc9-800d-46da-a623-0c8a2144ac99	42b545e5-3f37-4222-a7fa-8c9b18e56455	0a5077d6-33b7-4fa8-b22b-62be427f1be7	194610b7-53ff-451a-b49d-9531e512227c	0.0	Sin condiciones especiales.
b32deb01-0ca4-440f-a523-f20294968477	2025-05-08 03:59:15.796637+00	2025-05-08 03:59:15.796637+00	Casa de lujo en condominio cerrado con seguridad 24/7.	200000	disponible	350	5	4	3	a16f033c-8f6c-415f-8f6b-7086af37b6bd	84c100f1-57d0-4c3d-8403-6318d428bd23	42b545e5-3f37-4222-a7fa-8c9b18e56455	bbbf4bd8-c5ed-4a26-98ae-c0a85abe1985	488ade4a-436b-4cd6-9869-c859ebaa7d0c	0.0	Sin condiciones especiales.
1d10a9c7-9d77-42c9-af72-1a472789186a	2025-05-08 03:59:22.352763+00	2025-05-08 03:59:22.352763+00	Departamento céntrico ideal para inversión, alta demanda de alquiler.	1500	disponible	90	2	1	1	a16f033c-8f6c-415f-8f6b-7086af37b6bd	bfdaddc9-800d-46da-a623-0c8a2144ac99	cc9a4734-01be-4772-bf6f-199130d17656	0a5077d6-33b7-4fa8-b22b-62be427f1be7	ee7f1ab6-8b1c-4b2e-b32b-867ab4fd55cd	0.0	Sin condiciones especiales.
745fcc28-31d8-4007-8636-1750501800c8	2025-05-08 03:59:28.939396+00	2025-05-08 03:59:28.939396+00	Terreno comercial estratégicamente ubicado, alto tráfico peatonal y vehicular.	150000	disponible	800	0	0	0	a16f033c-8f6c-415f-8f6b-7086af37b6bd	ff04c2ee-ec1f-43ad-bb8f-2361b88a7cc5	42b545e5-3f37-4222-a7fa-8c9b18e56455	bbbf4bd8-c5ed-4a26-98ae-c0a85abe1985	8a744748-24e5-4cbf-8913-4710ca0823bb	0.0	Sin condiciones especiales.
ebfc1b92-eb89-4544-a304-b6597aeebf1f	2025-05-08 03:59:34.421836+00	2025-05-08 03:59:34.421836+00	Penthouse de lujo con vista panorámica, terraza privada y jacuzzi.	180000	disponible	200	3	3	2	a16f033c-8f6c-415f-8f6b-7086af37b6bd	bfdaddc9-800d-46da-a623-0c8a2144ac99	56565f8f-2ebd-444f-a1c8-64343965071f	bbbf4bd8-c5ed-4a26-98ae-c0a85abe1985	7a95c0aa-70b1-4084-8603-a4e41b22dde2	0.0	Sin condiciones especiales.
76df2eb4-405e-43ab-835f-e276939cabcc	2025-05-08 08:17:44.471635+00	2025-05-08 08:17:44.471635+00	Casa de 5 habitaciones y 3 baños en el centro de la ciudad	150000	disponible	250	5	3	1	a16f033c-8f6c-415f-8f6b-7086af37b6bd	84c100f1-57d0-4c3d-8403-6318d428bd23	42b545e5-3f37-4222-a7fa-8c9b18e56455	081de8d4-f8aa-43aa-b9ad-93def510fb7c	0ba0d87b-5e33-48b9-838c-893f31a61c06	0.0	Sin condiciones especiales.
97109cb8-2450-4932-8646-73b624c60cf6	2025-05-08 08:19:27.646758+00	2025-05-08 08:19:27.646758+00	Terreno en venta 1500m2	200000	disponible	1500	0	0	3	a16f033c-8f6c-415f-8f6b-7086af37b6bd	ff04c2ee-ec1f-43ad-bb8f-2361b88a7cc5	42b545e5-3f37-4222-a7fa-8c9b18e56455	081de8d4-f8aa-43aa-b9ad-93def510fb7c	7a470019-eef9-4b7b-b7f4-31150579963c	0.0	Sin condiciones especiales.
a2d36f7e-d510-4c01-bfb6-b4dfa8379d34	2025-05-08 08:21:08.056086+00	2025-05-08 08:21:08.056086+00	Departamento en alquiler	3000	disponible	400	5	2	1	a16f033c-8f6c-415f-8f6b-7086af37b6bd	bfdaddc9-800d-46da-a623-0c8a2144ac99	cc9a4734-01be-4772-bf6f-199130d17656	081de8d4-f8aa-43aa-b9ad-93def510fb7c	f7b12e29-dccf-480a-b03f-da83f557a78c	0.0	Sin condiciones especiales.
\.


--
-- Data for Name: property_owner; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.property_owner (id, created_at, updated_at, property_id, owner_id) FROM stdin;
0c71234b-e61b-4c99-bbd5-186bb4741528	2025-05-08 03:58:38.2682+00	2025-05-08 03:58:38.2682+00	ee15c5e4-75fa-4ab7-8f5d-05ad3cc2658d	38f71caa-8b30-41ef-ac3f-4520758c9717
5c949753-eca9-4f90-a6b7-ec29fba7c205	2025-05-08 03:58:44.87478+00	2025-05-08 03:58:44.87478+00	61e7adec-714d-42be-bede-8d0fb1aaa3ab	aa1c78db-1edc-40a0-9d5a-42ff854547ee
2c25fd87-b15f-4abc-a6f7-5ed636e3e250	2025-05-08 03:58:51.450598+00	2025-05-08 03:58:51.450598+00	047ad27f-9e15-4055-adf0-4b25bc169b25	7e08b464-f1ff-414e-9942-37febe0eace2
4536c24f-35ef-41f8-9aad-25d22f53fea6	2025-05-08 03:58:58.081099+00	2025-05-08 03:58:58.081099+00	367ee43b-7b4b-455d-a04a-bcb5f03b67d8	674aa0e3-1d8c-44ff-9e49-718ddfc2420a
86efd05f-d6f4-4de2-8437-16a5c07fb9cf	2025-05-08 03:59:03.672864+00	2025-05-08 03:59:03.672864+00	7cb567e5-07d1-4963-a0ee-3e12a0cc23a0	3edc5a18-ca01-415e-9f2d-61553fd60d88
06653c8e-ec76-46dd-bd12-feab1890c349	2025-05-08 03:59:10.254503+00	2025-05-08 03:59:10.254503+00	614f504a-619e-46e9-90de-a611684f2b9a	38f71caa-8b30-41ef-ac3f-4520758c9717
fa5eb0ff-a778-4005-b383-bba78672f4b5	2025-05-08 03:59:16.818545+00	2025-05-08 03:59:16.818545+00	b32deb01-0ca4-440f-a523-f20294968477	aa1c78db-1edc-40a0-9d5a-42ff854547ee
d128c293-57b4-4edf-b18b-db8cbcf07c07	2025-05-08 03:59:23.377364+00	2025-05-08 03:59:23.377364+00	1d10a9c7-9d77-42c9-af72-1a472789186a	7e08b464-f1ff-414e-9942-37febe0eace2
c64ec5fc-7272-4d4f-b798-1a803babafeb	2025-05-08 03:59:29.956357+00	2025-05-08 03:59:29.956357+00	745fcc28-31d8-4007-8636-1750501800c8	674aa0e3-1d8c-44ff-9e49-718ddfc2420a
4142dca2-e997-4957-ae88-c1dc1b5e6fd5	2025-05-08 03:59:35.436827+00	2025-05-08 03:59:35.436827+00	ebfc1b92-eb89-4544-a304-b6597aeebf1f	3edc5a18-ca01-415e-9f2d-61553fd60d88
\.


--
-- Data for Name: realstate; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.realstate (id, created_at, updated_at, name, email, address) FROM stdin;
65587d86-d8b6-4f76-a35e-e16142beab6a	2025-05-08 03:58:24.811686+00	2025-05-08 03:58:24.811686+00	Century 21	info@century21.com.bo	Av. Ballivián #1234, Cochabamba
f7e07e4f-edbc-4724-b746-587c02a9df8f	2025-05-08 03:58:25.426945+00	2025-05-08 03:58:25.426945+00	Remax	contacto@remax.com.bo	Calle Sucre #567, Santa Cruz
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.role (id, created_at, updated_at, name) FROM stdin;
8d85ef6b-79f9-44ae-8978-81621126b5d4	2025-05-08 03:58:00.94479+00	2025-05-08 03:58:00.94479+00	Administrador SU
83dfa3e7-251a-4b4a-a490-77f7d3300541	2025-05-08 03:58:03.072169+00	2025-05-08 03:58:03.072169+00	Administrador TI
\.


--
-- Data for Name: sector; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.sector (id, created_at, updated_at, name, adress, phone, real_state_id) FROM stdin;
78ff7d7c-a608-4f18-9907-4f8c8c82ef49	2025-05-08 03:58:26.830607+00	2025-05-08 03:58:26.830607+00	Zona Norte	Av. América #789, Cochabamba	4245678	65587d86-d8b6-4f76-a35e-e16142beab6a
efb48293-dcaa-4066-a11f-e56b1690c8bb	2025-05-08 03:58:27.852898+00	2025-05-08 03:58:27.852898+00	Zona Centro	Calle Jordán #456, Cochabamba	4256789	65587d86-d8b6-4f76-a35e-e16142beab6a
0a5077d6-33b7-4fa8-b22b-62be427f1be7	2025-05-08 03:58:28.879531+00	2025-05-08 03:58:28.879531+00	Centro	Av. Irala #321, Santa Cruz	3345678	65587d86-d8b6-4f76-a35e-e16142beab6a
bbbf4bd8-c5ed-4a26-98ae-c0a85abe1985	2025-05-08 03:58:29.927982+00	2025-05-08 03:58:29.927982+00	Equipetrol	Av. San Martín #987, Santa Cruz	3356789	65587d86-d8b6-4f76-a35e-e16142beab6a
081de8d4-f8aa-43aa-b9ad-93def510fb7c	2025-05-08 07:53:50.581853+00	2025-05-08 07:53:50.581853+00	Centrar Remax	Av. Alemana #123	77162321	f7e07e4f-edbc-4724-b746-587c02a9df8f
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.subscription (id, created_at, updated_at, init_date, end_date, last_payment_date, next_payment_date, state, renewal, real_state_id, plan_id) FROM stdin;
\.


--
-- Data for Name: subscription_payment; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.subscription_payment (id, created_at, updated_at, payment_date, amount, state, subscription_id, payment_method_id) FROM stdin;
\.


--
-- Data for Name: ubicacion; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public.ubicacion (id, created_at, updated_at, direccion, pais, ciudad, latitud, longitud) FROM stdin;
8b747aae-3774-4ed7-be9e-b5cab191a0c4	2025-05-08 03:58:49.784046+00	2025-05-08 03:58:49.784046+00	Av. América #456, Zona Norte	Bolivia	Cochabamba	-17.3677120	-66.1557400
488ade4a-436b-4cd6-9869-c859ebaa7d0c	2025-05-08 03:59:15.188148+00	2025-05-08 03:59:15.188148+00	Calle Beni #567, Centro	Bolivia	Santa Cruz	-17.7845430	-63.1823670
ee7f1ab6-8b1c-4b2e-b32b-867ab4fd55cd	2025-05-08 03:59:21.751206+00	2025-05-08 03:59:21.751206+00	Av. Irala #890, Centro	Bolivia	Santa Cruz	-17.7907650	-63.1783760
8a744748-24e5-4cbf-8913-4710ca0823bb	2025-05-08 03:59:28.339027+00	2025-05-08 03:59:28.339027+00	Av. San Martín #345, Las Palmas	Bolivia	Santa Cruz	-17.7789630	-63.1658440
7a95c0aa-70b1-4084-8603-a4e41b22dde2	2025-05-08 03:59:33.824121+00	2025-05-08 03:59:33.824121+00	Calle Los Jazmines #678, Equipetrol Norte	Bolivia	Santa Cruz	-17.7754210	-63.1832650
194610b7-53ff-451a-b49d-9531e512227c	2025-05-08 03:59:08.624097+00	2025-05-08 03:59:08.624097+00	Av. Ballivián #234, Equipetrol	Bolivia	Santa Cruz	-17.7790884	-63.1983590
38bb2ff1-9831-4d44-8036-7d548a8fe8b7	2025-05-08 03:58:56.335206+00	2025-05-08 03:58:56.335206+00	Av. Santa Cruz #789, Cala Cala	Bolivia	Cochabamba	-17.7567237	-63.1822032
79c3af87-6ead-4f38-8a06-5e6e0d372000	2025-05-08 03:58:43.218884+00	2025-05-08 03:58:43.218884+00	Calle Bolívar #123, Cercado	Bolivia	Cochabamba	-17.7578266	-63.1648225
82ed6f07-4b48-4d89-b165-5a33b25f98fd	2025-05-08 03:59:01.991311+00	2025-05-08 03:59:01.991311+00	Av. Blanco Galindo km 2, Zona Oeste	Bolivia	Cochabamba	-17.7942606	-63.1773475
7a470019-eef9-4b7b-b7f4-31150579963c	2025-05-08 08:19:27.067095+00	2025-05-08 08:19:27.067095+00	7mo anillo, Canal cotoca	Bolivia	Santa Cruz	-17.7993725	-63.1228304
0ba0d87b-5e33-48b9-838c-893f31a61c06	2025-05-08 08:17:43.869245+00	2025-05-08 08:17:43.869245+00	Av. Principal 123, Barrio Centro	Bolivia	Santa Cruz	-17.7623457	-63.1747841
f7b12e29-dccf-480a-b03f-da83f557a78c	2025-05-08 08:21:07.461758+00	2025-05-08 08:21:07.461758+00	4to Anillo, radial 17 y medio	Bolivia	Santa Cruz	-17.8047282	-63.1604532
f6c287c0-56f5-4c0b-a03a-ef615848218e	2025-05-08 03:58:36.613409+00	2025-05-08 03:58:36.613409+00	Av. Villazón km 5, Sacaba	Bolivia	Santa Cruz	-17.8006112	-63.1796132
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: inmobiliaria_owner
--

COPY public."user" (id, created_at, updated_at, ci, name, email, password, phone, gender, is_active, role_id, sector_id) FROM stdin;
d10c71c6-dd2d-4207-95e8-a81c8ede69ea	2025-05-08 03:58:10.7581+00	2025-05-08 03:58:10.7581+00	12345678	Administrador SU	adminSU@gmail.com	$2b$10$wBggTzTAf6FDw3ao1yjdUO1DEVmIqvPZniqsiwRZWbg3FAt8NnH8G	12345678	femenino	t	8d85ef6b-79f9-44ae-8978-81621126b5d4	\N
276e6956-de78-471b-9d27-daa96dfccdc3	2025-05-08 03:58:32.05601+00	2025-05-08 03:58:32.05601+00	87654321	Juan Pérez	jperez@century21.com.bo	$2b$10$FvK5Xqozorj3wP64r52zoeM1g3SJSaIMT7wFgDGl2g2XnrvuUPOOC	76543219	masculino	t	83dfa3e7-251a-4b4a-a490-77f7d3300541	78ff7d7c-a608-4f18-9907-4f8c8c82ef49
a16f033c-8f6c-415f-8f6b-7086af37b6bd	2025-05-08 03:58:33.931982+00	2025-05-08 03:58:33.931982+00	76543210	Ana García	agarcia@remax.com.bo	$2b$10$nO78NjMxyq7HodIYCcAXbeDnTzfY1Y6tAfQTudMIK8AQ7aG/N0Xam	70123457	femenino	t	83dfa3e7-251a-4b4a-a490-77f7d3300541	0a5077d6-33b7-4fa8-b22b-62be427f1be7
\.


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: property_owner PK_2541d2fb798d385a0521553370d; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "PK_2541d2fb798d385a0521553370d" PRIMARY KEY (id);


--
-- Name: subscription_payment PK_25f8afce4159ee83cf8c6da622d; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "PK_25f8afce4159ee83cf8c6da622d" PRIMARY KEY (id);


--
-- Name: permission_rol PK_3177c382bd83734f1cc0d789a92; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "PK_3177c382bd83734f1cc0d789a92" PRIMARY KEY (id);


--
-- Name: permission PK_3b8b97af9d9d8807e41e6f48362; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY (id);


--
-- Name: modalities PK_4135bf3c2e5bb971c20b08bbef1; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.modalities
    ADD CONSTRAINT "PK_4135bf3c2e5bb971c20b08bbef1" PRIMARY KEY (id);


--
-- Name: plan PK_54a2b686aed3b637654bf7ddbb3; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY (id);


--
-- Name: sector PK_668b2ea8a2f534425407732f3ab; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT "PK_668b2ea8a2f534425407732f3ab" PRIMARY KEY (id);


--
-- Name: ubicacion PK_6ed79468fe4f565d8be642742a3; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT "PK_6ed79468fe4f565d8be642742a3" PRIMARY KEY (id);


--
-- Name: payment_method PK_7744c2b2dd932c9cf42f2b9bc3a; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY (id);


--
-- Name: subscription PK_8c3e00ebd02103caa1174cd5d9d; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY (id);


--
-- Name: owner PK_8e86b6b9f94aece7d12d465dc0c; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY (id);


--
-- Name: client PK_96da49381769303a6515a8785c7; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY (id);


--
-- Name: realstate PK_98e1482af627189d667923cc906; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.realstate
    ADD CONSTRAINT "PK_98e1482af627189d667923cc906" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: imagen PK_c9838d52bca36e9244bcb95bee6; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT "PK_c9838d52bca36e9244bcb95bee6" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: property PK_d80743e6191258a5003d5843b4f; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY (id);


--
-- Name: property REL_ee35ca44a21b2c3ac6f63373b0; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "REL_ee35ca44a21b2c3ac6f63373b0" UNIQUE (ubicacion_id);


--
-- Name: user UQ_098e105d84a153cfa5d8306df98; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_098e105d84a153cfa5d8306df98" UNIQUE (ci);


--
-- Name: permission UQ_240853a0c3353c25fb12434ad33; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE (name);


--
-- Name: realstate UQ_48b01f015648c932089710d1a4e; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.realstate
    ADD CONSTRAINT "UQ_48b01f015648c932089710d1a4e" UNIQUE (email);


--
-- Name: owner UQ_5e6481e57aef4cd2b3a8339a476; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "UQ_5e6481e57aef4cd2b3a8339a476" UNIQUE (ci);


--
-- Name: payment_method UQ_6101666760258a840e115e1bb11; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT "UQ_6101666760258a840e115e1bb11" UNIQUE (name);


--
-- Name: client UQ_6436cc6b79593760b9ef921ef12; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE (email);


--
-- Name: owner UQ_7431bbd2e694ee4a80c32bd7ef8; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT "UQ_7431bbd2e694ee4a80c32bd7ef8" UNIQUE (email);


--
-- Name: role UQ_ae4578dcaed5adff96595e61660; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);


--
-- Name: client UQ_bf46f19067f5138aa6b8054da45; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "UQ_bf46f19067f5138aa6b8054da45" UNIQUE (ci);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: permission_rol FK_0f88f52686ae64eaea0e2ffa752; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "FK_0f88f52686ae64eaea0e2ffa752" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: property_owner FK_333bdbeee5a1f17a5f70fb24d66; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "FK_333bdbeee5a1f17a5f70fb24d66" FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON DELETE CASCADE;


--
-- Name: subscription FK_5fde988e5d9b9a522d70ebec27c; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c" FOREIGN KEY (plan_id) REFERENCES public.plan(id) ON DELETE CASCADE;


--
-- Name: property FK_723792fc2012f8a4c47915d1e25; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_723792fc2012f8a4c47915d1e25" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: property FK_8b8dd7ba29b1834e5158ec4d4a0; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_8b8dd7ba29b1834e5158ec4d4a0" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: subscription FK_92949b15e6fe44bdafa7368cc77; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "FK_92949b15e6fe44bdafa7368cc77" FOREIGN KEY (real_state_id) REFERENCES public.realstate(id) ON DELETE CASCADE;


--
-- Name: subscription_payment FK_ad0ebe8b66ad9e06c8324a76591; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "FK_ad0ebe8b66ad9e06c8324a76591" FOREIGN KEY (subscription_id) REFERENCES public.subscription(id) ON DELETE CASCADE;


--
-- Name: imagen FK_afe9d7a110e1c9035075cbd50ab; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.imagen
    ADD CONSTRAINT "FK_afe9d7a110e1c9035075cbd50ab" FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- Name: sector FK_b81921128bd54ad0b068e717f30; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT "FK_b81921128bd54ad0b068e717f30" FOREIGN KEY (real_state_id) REFERENCES public.realstate(id) ON DELETE CASCADE;


--
-- Name: user FK_bda5a4115efba8b39ce5de164ee; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_bda5a4115efba8b39ce5de164ee" FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE CASCADE;


--
-- Name: property_owner FK_c0a0fe356fc308a185fbda2c3bd; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property_owner
    ADD CONSTRAINT "FK_c0a0fe356fc308a185fbda2c3bd" FOREIGN KEY (property_id) REFERENCES public.property(id) ON DELETE CASCADE;


--
-- Name: property FK_ce47de03834f0620de39774ed8a; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_ce47de03834f0620de39774ed8a" FOREIGN KEY (modality_id) REFERENCES public.modalities(id) ON DELETE CASCADE;


--
-- Name: permission_rol FK_ce4d00b44009802ca244e4accb4; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.permission_rol
    ADD CONSTRAINT "FK_ce4d00b44009802ca244e4accb4" FOREIGN KEY (permission_id) REFERENCES public.permission(id);


--
-- Name: subscription_payment FK_ce8a06519352654346c3376529b; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.subscription_payment
    ADD CONSTRAINT "FK_ce8a06519352654346c3376529b" FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id) ON DELETE CASCADE;


--
-- Name: property FK_d7856cf056ab52753be88383142; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_d7856cf056ab52753be88383142" FOREIGN KEY (sector_id) REFERENCES public.sector(id) ON DELETE CASCADE;


--
-- Name: property FK_ee35ca44a21b2c3ac6f63373b05; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT "FK_ee35ca44a21b2c3ac6f63373b05" FOREIGN KEY (ubicacion_id) REFERENCES public.ubicacion(id) ON DELETE CASCADE;


--
-- Name: user FK_fb2e442d14add3cefbdf33c4561; Type: FK CONSTRAINT; Schema: public; Owner: inmobiliaria_owner
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

