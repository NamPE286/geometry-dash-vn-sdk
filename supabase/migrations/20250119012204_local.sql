drop policy "Enable read access for all users" on "public"."user_roles";

revoke delete on table "public"."user_roles" from "anon";

revoke insert on table "public"."user_roles" from "anon";

revoke references on table "public"."user_roles" from "anon";

revoke select on table "public"."user_roles" from "anon";

revoke trigger on table "public"."user_roles" from "anon";

revoke truncate on table "public"."user_roles" from "anon";

revoke update on table "public"."user_roles" from "anon";

revoke delete on table "public"."user_roles" from "authenticated";

revoke insert on table "public"."user_roles" from "authenticated";

revoke references on table "public"."user_roles" from "authenticated";

revoke select on table "public"."user_roles" from "authenticated";

revoke trigger on table "public"."user_roles" from "authenticated";

revoke truncate on table "public"."user_roles" from "authenticated";

revoke update on table "public"."user_roles" from "authenticated";

revoke delete on table "public"."user_roles" from "service_role";

revoke insert on table "public"."user_roles" from "service_role";

revoke references on table "public"."user_roles" from "service_role";

revoke select on table "public"."user_roles" from "service_role";

revoke trigger on table "public"."user_roles" from "service_role";

revoke truncate on table "public"."user_roles" from "service_role";

revoke update on table "public"."user_roles" from "service_role";

alter table "public"."users" drop constraint "users_role_fkey";

alter table "public"."user_roles" drop constraint "roles_pkey";

drop index if exists "public"."roles_pkey";

drop table "public"."user_roles";

create table "public"."user_role" (
    "name" text not null,
    "add_level" boolean not null default false,
    "modify_level" boolean not null default false,
    "delete_level" boolean not null default false,
    "review_submission" boolean not null default false,
    "modify_record" boolean not null default false,
    "remove_record" boolean not null default false,
    "submit" boolean not null default true,
    "edit_own_profile" boolean not null default true
);


alter table "public"."user_role" enable row level security;

CREATE UNIQUE INDEX roles_pkey ON public.user_role USING btree (name);

alter table "public"."user_role" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."users" add constraint "users_role_fkey" FOREIGN KEY (role) REFERENCES user_role(name) not valid;

alter table "public"."users" validate constraint "users_role_fkey";

grant delete on table "public"."user_role" to "anon";

grant insert on table "public"."user_role" to "anon";

grant references on table "public"."user_role" to "anon";

grant select on table "public"."user_role" to "anon";

grant trigger on table "public"."user_role" to "anon";

grant truncate on table "public"."user_role" to "anon";

grant update on table "public"."user_role" to "anon";

grant delete on table "public"."user_role" to "authenticated";

grant insert on table "public"."user_role" to "authenticated";

grant references on table "public"."user_role" to "authenticated";

grant select on table "public"."user_role" to "authenticated";

grant trigger on table "public"."user_role" to "authenticated";

grant truncate on table "public"."user_role" to "authenticated";

grant update on table "public"."user_role" to "authenticated";

grant delete on table "public"."user_role" to "service_role";

grant insert on table "public"."user_role" to "service_role";

grant references on table "public"."user_role" to "service_role";

grant select on table "public"."user_role" to "service_role";

grant trigger on table "public"."user_role" to "service_role";

grant truncate on table "public"."user_role" to "service_role";

grant update on table "public"."user_role" to "service_role";

create policy "Enable read access for all users"
on "public"."user_role"
as permissive
for select
to public
using (true);



