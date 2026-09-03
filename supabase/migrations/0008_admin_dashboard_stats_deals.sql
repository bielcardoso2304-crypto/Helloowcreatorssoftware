-- Extends admin_dashboard_stats() (0006) with metrics from the new
-- `deals` table (0007): how many deals closed, total value negotiated,
-- how much Helloow earned, and the count by month.
create or replace function admin_dashboard_stats()
returns json
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  result json;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'total_creators', (select count(*) from creators),
    'new_last_30_days', (
      select count(*) from creators where created_at >= now() - interval '30 days'
    ),
    'total_connections', (select count(*) from connections),
    'total_reach', (
      select coalesce(sum(
        coalesce(instagram_followers, 0)
        + coalesce(tiktok_followers, 0)
        + coalesce(youtube_followers, 0)
      ), 0)
      from creators
    ),
    'signups_by_month', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select to_char(date_trunc('month', months.month), 'YYYY-MM') as month,
          count(creators.created_at) as count
        from generate_series(
          date_trunc('month', now()) - interval '5 months',
          date_trunc('month', now()),
          interval '1 month'
        ) as months(month)
        left join creators
          on date_trunc('month', creators.created_at) = months.month
        group by months.month
        order by months.month
      ) t
    ),
    'by_platform', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select main_platform as platform, count(*) as count
        from creators
        group by main_platform
        order by count desc
      ) t
    ),
    'top_niches', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select niche, count(*) as count
        from creators
        where niche is not null and niche <> ''
        group by niche
        order by count desc
        limit 5
      ) t
    ),
    'total_deals', (select count(*) from deals),
    'total_deal_value', (select coalesce(sum(deal_value), 0) from deals),
    'total_company_earning', (select coalesce(sum(company_earning), 0) from deals),
    'deals_by_month', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select to_char(date_trunc('month', months.month), 'YYYY-MM') as month,
          count(deals.id) as count
        from generate_series(
          date_trunc('month', now()) - interval '5 months',
          date_trunc('month', now()),
          interval '1 month'
        ) as months(month)
        left join deals
          on date_trunc('month', deals.deal_date) = months.month
        group by months.month
        order by months.month
      ) t
    )
  ) into result;

  return result;
end;
$$;
