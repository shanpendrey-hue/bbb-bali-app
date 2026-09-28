-- B.B.B v78 Guest Management reliability fix + Beanbags, Beers & Sunset RSVP
-- Run ONCE in Supabase > SQL Editor before testing v78.
-- This does not delete existing B.B.B data.

alter table public.bbb_guest_management
  add column if not exists beanbags_beers_sunset boolean not null default false,
  add column if not exists sunset_rsvp_at timestamptz;

create or replace function public.bbb_sync_guest_management(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_guest_id text := nullif(p_payload->>'guestId','');
  v_name text := nullif(p_payload->>'name','');
  v_now timestamptz := coalesce(nullif(p_payload->>'updatedAt','')::timestamptz, now());
  v_signed timestamptz := coalesce(nullif(p_payload->>'signedUp','')::timestamptz, v_now);
  v_sunset boolean := false;
  v_sunset_at timestamptz := null;
  v_item jsonb;
  v_booking_id text;
  v_qty integer;
  v_total numeric;
  v_paid numeric;
  v_drink_total numeric;
begin
  if v_guest_id is null or v_name is null then
    raise exception 'guestId and name are required';
  end if;

  select exists(
    select 1 from jsonb_array_elements(coalesce(p_payload->'plans','[]'::jsonb)) x
    where x->>'type'='sunset'
  ) into v_sunset;

  if v_sunset then
    select coalesce(nullif(x->>'updatedAt','')::timestamptz,
                    nullif(x->>'bookedAt','')::timestamptz,
                    v_now)
      into v_sunset_at
    from jsonb_array_elements(coalesce(p_payload->'plans','[]'::jsonb)) x
    where x->>'type'='sunset'
    limit 1;
  end if;

  insert into public.bbb_guest_management
    (guest_id,name,signed_up,updated_at,flight_details,profile_data,beanbags_beers_sunset,sunset_rsvp_at)
  values
    (v_guest_id,v_name,v_signed,v_now,coalesce(p_payload->'flights','{}'::jsonb),
     jsonb_build_object('profile',coalesce(p_payload->'profile','{}'::jsonb),'flights',coalesce(p_payload->'flights','{}'::jsonb)),
     v_sunset,v_sunset_at)
  on conflict (guest_id) do update set
    name=excluded.name,
    updated_at=excluded.updated_at,
    flight_details=excluded.flight_details,
    profile_data=excluded.profile_data,
    beanbags_beers_sunset=excluded.beanbags_beers_sunset,
    sunset_rsvp_at=coalesce(public.bbb_guest_management.sunset_rsvp_at,excluded.sunset_rsvp_at);

  if p_payload->'airportPickup' is not null and jsonb_typeof(p_payload->'airportPickup')='object' then
    v_item := p_payload->'airportPickup';
    v_booking_id := coalesce(nullif(v_item->>'bookingId',''),'made-'||v_guest_id);
    select coalesce(sum(coalesce((d->>'qty')::numeric,0)*coalesce((d->>'price')::numeric,0)),0)
      into v_drink_total
    from jsonb_array_elements(coalesce(v_item->'drinks','[]'::jsonb)) d;
    insert into public.bbb_made_driver
      (booking_id,guest_id,guest_name,status,destination,transfer_price_aud,drinks,drinks_total_aud,total_aud,flight_details,updated_at)
    values
      (v_booking_id,v_guest_id,v_name,coalesce(nullif(v_item->>'status',''),'booked'),coalesce(v_item->>'area',''),
       coalesce((v_item->>'ridePrice')::numeric,0),coalesce(v_item->'drinks','[]'::jsonb),v_drink_total,
       coalesce((v_item->>'ridePrice')::numeric,0)+v_drink_total,coalesce(p_payload->'flights'->'outbound','{}'::jsonb),
       coalesce(nullif(v_item->>'updatedAt','')::timestamptz,nullif(v_item->>'cancelledAt','')::timestamptz,v_now))
    on conflict (booking_id) do update set
      guest_name=excluded.guest_name,status=excluded.status,destination=excluded.destination,
      transfer_price_aud=excluded.transfer_price_aud,drinks=excluded.drinks,drinks_total_aud=excluded.drinks_total_aud,
      total_aud=excluded.total_aud,flight_details=excluded.flight_details,updated_at=excluded.updated_at;
  end if;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'bookings','[]'::jsonb)) loop
    v_booking_id := nullif(v_item->>'id','');
    if v_booking_id is not null then
      v_qty := greatest(1,coalesce((v_item->>'quantity')::integer,1));
      insert into public.bbb_massage_bookings
        (booking_id,guest_id,guest_name,status,massage,quantity,booking_date,booking_time,duration_mins,price_idr,total_idr,updated_at)
      values
        (v_booking_id,v_guest_id,v_name,coalesce(nullif(v_item->>'status',''),'booked'),coalesce(v_item->>'treatment',''),v_qty,
         coalesce(v_item->>'date',''),coalesce(v_item->>'slot',''),coalesce((v_item->>'mins')::integer,0),
         coalesce((v_item->>'price')::numeric,0),coalesce((v_item->>'price')::numeric,0)*v_qty,
         coalesce(nullif(v_item->>'updatedAt','')::timestamptz,v_now))
      on conflict (booking_id) do update set
        guest_name=excluded.guest_name,status=excluded.status,massage=excluded.massage,quantity=excluded.quantity,
        booking_date=excluded.booking_date,booking_time=excluded.booking_time,duration_mins=excluded.duration_mins,
        price_idr=excluded.price_idr,total_idr=excluded.total_idr,updated_at=excluded.updated_at;
    end if;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'plans','[]'::jsonb)) where value->>'type'='pizza' loop
    v_booking_id := coalesce(nullif(v_item->>'bookingId',''),'pizza-'||v_guest_id);
    v_qty := greatest(1,coalesce((v_item->>'people')::integer,1));
    v_total := coalesce((v_item->>'totalDue')::numeric,(v_item->>'totalPaid')::numeric,(v_item->>'price')::numeric,249000*v_qty);
    v_paid := coalesce((v_item->>'paidAmount')::numeric,(v_item->>'totalPaid')::numeric,0);
    insert into public.bbb_pizza_party
      (booking_id,guest_id,guest_name,status,option_name,quantity,price_each_idr,total_idr,payment_status,amount_paid_idr,updated_at)
    values
      (v_booking_id,v_guest_id,v_name,coalesce(nullif(v_item->>'status',''),'booked'),coalesce(nullif(v_item->>'title',''),'Bali Pizza Party'),
       v_qty,round(v_total/v_qty),v_total,
       case when coalesce((v_item->>'paymentMarked')::boolean,false) or v_item->>'pay'='paid' or v_paid>=v_total then 'Paid' else 'Unpaid' end,
       v_paid,coalesce(nullif(v_item->>'updatedAt','')::timestamptz,nullif(v_item->>'bookedAt','')::timestamptz,v_now))
    on conflict (booking_id) do update set
      guest_name=excluded.guest_name,status=excluded.status,option_name=excluded.option_name,quantity=excluded.quantity,
      price_each_idr=excluded.price_each_idr,total_idr=excluded.total_idr,payment_status=excluded.payment_status,
      amount_paid_idr=excluded.amount_paid_idr,updated_at=excluded.updated_at;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'events','[]'::jsonb)) where value->>'type'='pizza' loop
    v_booking_id := nullif(v_item->>'bookingId','');
    if v_booking_id is not null then
      v_qty := greatest(1,coalesce((v_item->>'quantity')::integer,1));
      insert into public.bbb_pizza_party
        (booking_id,guest_id,guest_name,status,option_name,quantity,price_each_idr,total_idr,payment_status,amount_paid_idr,updated_at)
      values
        (v_booking_id,v_guest_id,v_name,'cancelled','Bali Pizza Party',v_qty,coalesce((v_item->>'unitPrice')::numeric,249000),
         coalesce((v_item->>'total')::numeric,0),coalesce(nullif(v_item->>'paymentStatus',''),'Unpaid'),
         coalesce((v_item->>'paidAmount')::numeric,0),coalesce(nullif(v_item->>'at','')::timestamptz,v_now))
      on conflict (booking_id) do update set status='cancelled',updated_at=excluded.updated_at;
    end if;
  end loop;

  return jsonb_build_object('ok',true,'guest_id',v_guest_id);
end;
$$;

revoke all on function public.bbb_sync_guest_management(jsonb) from public;
grant execute on function public.bbb_sync_guest_management(jsonb) to anon, authenticated;
