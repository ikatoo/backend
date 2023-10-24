-- Adminer 4.8.1 PostgreSQL 14.9 dump

DROP TABLE IF EXISTS "about_pages";
DROP SEQUENCE IF EXISTS about_pages_id_seq;
CREATE SEQUENCE about_pages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."about_pages" (
    "id" integer DEFAULT nextval('about_pages_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "illustration_url" character varying,
    "illustration_alt" character varying,
    "user_id" integer NOT NULL,
    CONSTRAINT "about_pages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "about_pages_user_id" UNIQUE ("user_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "contacts_page";
DROP SEQUENCE IF EXISTS contacts_page_id_seq;
CREATE SEQUENCE contacts_page_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."contacts_page" (
    "id" integer DEFAULT nextval('contacts_page_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "localization" point NOT NULL,
    "email" character varying NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "contacts_page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "contacts_page_user_id" UNIQUE ("user_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "projects";
DROP SEQUENCE IF EXISTS projects_id_seq;
CREATE SEQUENCE projects_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."projects" (
    "id" integer DEFAULT nextval('projects_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "snapshot" character varying NOT NULL,
    "repository_link" character varying NOT NULL,
    "last_update" character varying NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "projects_on_users";
DROP SEQUENCE IF EXISTS projects_on_users_id_seq;
CREATE SEQUENCE projects_on_users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."projects_on_users" (
    "id" integer DEFAULT nextval('projects_on_users_id_seq') NOT NULL,
    "project_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "projects_on_users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "skills";
DROP SEQUENCE IF EXISTS skills_id_seq;
CREATE SEQUENCE skills_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills" (
    "id" integer DEFAULT nextval('skills_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    CONSTRAINT "skills_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "skills_title" UNIQUE ("title")
) WITH (oids = false);


DROP TABLE IF EXISTS "skills_on_users";
DROP SEQUENCE IF EXISTS skills_on_users_id_seq;
CREATE SEQUENCE skills_on_users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills_on_users" (
    "id" integer DEFAULT nextval('skills_on_users_id_seq') NOT NULL,
    "skill_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "skills_on_users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "skills_page";
DROP SEQUENCE IF EXISTS skills_page_id_seq;
CREATE SEQUENCE skills_page_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills_page" (
    "id" integer DEFAULT nextval('skills_page_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "skills_page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "skills_page_user_id" UNIQUE ("user_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "token_blacklist";
DROP SEQUENCE IF EXISTS token_blacklist_id_seq;
CREATE SEQUENCE token_blacklist_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."token_blacklist" (
    "id" integer DEFAULT nextval('token_blacklist_id_seq') NOT NULL,
    "code" character varying NOT NULL,
    CONSTRAINT "token_blacklist_code" UNIQUE ("code"),
    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "hash_password" character varying NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."about_pages" ADD CONSTRAINT "about_pages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."contacts_page" ADD CONSTRAINT "contacts_page_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."projects_on_users" ADD CONSTRAINT "projects_on_users_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."projects_on_users" ADD CONSTRAINT "projects_on_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."skills_on_users" ADD CONSTRAINT "skills_on_users_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skills(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."skills_on_users" ADD CONSTRAINT "skills_on_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."skills_page" ADD CONSTRAINT "skills_page_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- 2023-10-23 16:40:42.251427+00