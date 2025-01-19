create policy "Enable read access for all users"
on "public"."levels"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."user_roles"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);



