set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  refresh materialized view records_view;
end;$function$
;


