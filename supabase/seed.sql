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
	(71025973, '2025-01-18 10:25:33.965152+00', 'Oblivion', 'dice88 & more', 'bsWqS5QPhz8'),
	(52374843, '2025-01-19 18:16:01.572288+00', 'Zodiac', 'Bianox and more', 'FX9paD5rRsM');


--
-- Data for Name: level_rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."level_rating" ("id", "list", "rating", "min_progress") VALUES
	(52374843, 'demon', 3000, 60),
	(71025973, 'demon', 4100, 60),
	(52374843, 'featured', 1000, 100);


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
	('ded6b269-a856-4a49-a1ae-d8837d50e350', '2025-01-18 09:56:19.965229+00', 'default', 'Hạ Long', 'Quảng Ninh', 'default', false);


--
-- Data for Name: records; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."records" ("created_at", "user_id", "level_id", "video_link", "progress") VALUES
	('2025-01-19 18:23:15.798575+00', 'ded6b269-a856-4a49-a1ae-d8837d50e350', 52374843, 'https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D', 87),
	('2025-01-19 18:23:58.679907+00', 'ded6b269-a856-4a49-a1ae-d8837d50e350', 71025973, 'https://www.youtube.com/watch?v=c7E-tgmFuzw&pp=ygUIcG9wIGluIDI%3D', 100);


--
-- Name: level_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."level_rating_id_seq"', 1, false);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."levels_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
