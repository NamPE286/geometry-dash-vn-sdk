alter table "public"."level_rating" drop constraint "level_rating_pkey";

drop index if exists "public"."level_rating_pkey";

CREATE UNIQUE INDEX level_rating_pkey ON public.level_rating USING btree (id, list);

alter table "public"."level_rating" add constraint "level_rating_pkey" PRIMARY KEY using index "level_rating_pkey";

create materialized view "public"."records_view" as  WITH tmp AS (
         SELECT records.user_id,
            records.level_id,
            records.progress,
            records.video_link,
            level_rating.list,
            level_rating.rating
           FROM (records
             LEFT JOIN level_rating ON ((records.level_id = level_rating.id)))
        )
 SELECT tmp.user_id,
    tmp.level_id,
    tmp.video_link,
    tmp.progress,
    tmp.list,
        CASE
            WHEN (tmp.progress = 100) THEN (tmp.rating)::double precision
            ELSE (((((tmp.rating * tmp.progress) / 100))::numeric * 0.8))::double precision
        END AS point
   FROM tmp;



