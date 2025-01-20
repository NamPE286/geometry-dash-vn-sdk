drop materialized view if exists "public"."records_view";

create materialized view "public"."records_view" as  WITH tmp AS (
         SELECT records.user_id,
            records.level_id,
            records.progress,
            records.video_link,
            level_rating.list,
            level_rating.rating,
            users.is_hidden
           FROM ((records
             LEFT JOIN level_rating ON ((records.level_id = level_rating.id)))
             LEFT JOIN users ON ((records.user_id = users.user_id)))
        )
 SELECT tmp.user_id,
    tmp.level_id,
    tmp.video_link,
    tmp.progress,
    tmp.list,
        CASE
            WHEN (tmp.progress = 100) THEN (tmp.rating)::double precision
            ELSE ((((((tmp.rating * tmp.progress) / 100))::numeric * (100)::numeric) / (150)::numeric))::double precision
        END AS point,
    rank() OVER (PARTITION BY tmp.list ORDER BY
        CASE
            WHEN (tmp.progress = 100) THEN (tmp.rating)::double precision
            ELSE ((((((tmp.rating * tmp.progress) / 100))::numeric * (100)::numeric) / (150)::numeric))::double precision
        END DESC) AS no
   FROM tmp
  WHERE (tmp.is_hidden = false);



