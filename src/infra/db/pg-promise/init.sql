-- Adminer 4.8.1 PostgreSQL 14.10 dump

CREATE SEQUENCE about_pages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."about_pages" (
    "id" integer DEFAULT nextval('about_pages_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "image_url" character varying,
    "image_alt" character varying,
    "user_id" integer NOT NULL,
    CONSTRAINT "about_pages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "about_pages_user_id" UNIQUE ("user_id")
) WITH (oids = false);


CREATE SEQUENCE contacts_page_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."contact_pages" (
    "id" integer DEFAULT nextval('contacts_page_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "localization" point NOT NULL,
    "email" character varying NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "contacts_page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "contacts_page_user_id" UNIQUE ("user_id")
) WITH (oids = false);


CREATE SEQUENCE projects_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."projects" (
    "id" integer DEFAULT nextval('projects_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "snapshot" character varying NOT NULL,
    "repository_link" character varying NOT NULL,
    "start" timestamp DEFAULT now() NOT NULL,
    "last_update" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE projects_on_users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."projects_on_users" (
    "id" integer DEFAULT nextval('projects_on_users_id_seq') NOT NULL,
    "project_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "projects_on_users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE skills_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills" (
    "id" integer DEFAULT nextval('skills_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    CONSTRAINT "skills_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "skills_title" UNIQUE ("title")
) WITH (oids = false);


CREATE SEQUENCE skills_on_users_projects_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills_on_users_projects" (
    "id" integer DEFAULT nextval('skills_on_users_projects_id_seq') NOT NULL,
    "skill_id" integer NOT NULL,
    "project_on_user_id" integer NOT NULL,
    CONSTRAINT "skills_on_projects_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE skills_page_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."skills_pages" (
    "id" integer DEFAULT nextval('skills_page_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "description" character varying NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "skills_page_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "skills_page_user_id" UNIQUE ("user_id")
) WITH (oids = false);


CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "hash_password" character varying NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email" UNIQUE ("email"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."about_pages" ADD CONSTRAINT "about_pages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."contact_pages" ADD CONSTRAINT "contacts_page_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."projects_on_users" ADD CONSTRAINT "projects_on_users_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."projects_on_users" ADD CONSTRAINT "projects_on_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."skills_on_users_projects" ADD CONSTRAINT "skills_on_projects_project_on_user_id_fkey" FOREIGN KEY (project_on_user_id) REFERENCES projects_on_users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."skills_on_users_projects" ADD CONSTRAINT "skills_on_projects_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skills(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."skills_pages" ADD CONSTRAINT "skills_page_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

-- 2023-11-21 13:33:01.122348+00
