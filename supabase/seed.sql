SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."levels" ("id", "created_at", "name", "creator", "youtube_video_id") VALUES
	(71025973, '2025-01-18 10:25:33.965152+00', 'Oblivion', 'dice88 & more', 'bsWqS5QPhz8');


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_role" ("name", "add_level", "modify_level", "delete_level", "review_submission", "modify_record", "remove_record", "submit", "edit_own_profile") VALUES
	('default', false, false, false, false, false, false, true, true),
	('trusted', false, false, false, true, false, false, true, true),
	('admin', true, true, true, true, true, true, true, true),
	('banned', false, false, false, false, false, false, false, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("user_id", "created_at", "name", "city", "province", "role", "is_hidden") VALUES
	('ded6b269-a856-4a49-a1ae-d8837d50e350', '2025-01-18 09:56:19.965229+00', 'default', 'Hạ Long', 'Quảng Ninh', 'default', false),
	('1e6cdc88-e239-43a6-aa33-7cf7c9912e3e', '2025-01-19 01:20:29.473956+00', 'test123', NULL, NULL, 'default', false);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."levels_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
