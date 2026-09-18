-- ============================================================
-- Ye Rater — seed data (albums + songs)
-- Run this AFTER 01_schema.sql. Safe to re-run: it clears and
-- re-inserts albums/songs (ratings are untouched since they
-- reference songs by id — re-running will cascade-delete old
-- songs/ratings, so only re-run this if you want a clean slate).
--
-- Tracklists are the standard/streaming editions. A few of the
-- newest projects (Donda 2, Vultures 2) ship only their most
-- well-known tracks since their tracklists vary by edition —
-- feel free to add/edit rows below to match what you and your
-- friends actually listen to.
-- ============================================================

truncate table public.ratings, public.songs, public.albums restart identity cascade;

-- Helper pattern: insert album, capture its id, insert its songs.

-- 1. The College Dropout (2004)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('The College Dropout', 2004, 1) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'We Don''t Care'), (2,'Graduation Day'), (3,'All Falls Down'), (4,'I''ll Fly Away'),
  (5,'Spaceship'), (6,'Jesus Walks'), (7,'Never Let Me Down'), (8,'Get Em High'),
  (9,'The New Workout Plan'), (10,'Slow Jamz'), (11,'Breathe In Breathe Out'),
  (12,'School Spirit'), (13,'Two Words'), (14,'Through the Wire'),
  (15,'Family Business'), (16,'Last Call')
) as t(n, title);

-- 2. Late Registration (2005)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Late Registration', 2005, 2) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Wake Up Mr. West'), (2,'Heard ''Em Say'), (3,'Touch the Sky'), (4,'Gold Digger'),
  (5,'Drive Slow'), (6,'My Way Home'), (7,'Crack Music'), (8,'Roses'),
  (9,'Bring Me Down'), (10,'Addiction'), (11,'Diamonds from Sierra Leone'),
  (12,'We Major'), (13,'Hey Mama'), (14,'Celebration'), (15,'Gone'), (16,'Late')
) as t(n, title);

-- 3. Graduation (2007)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Graduation', 2007, 3) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Good Morning'), (2,'Champion'), (3,'Stronger'), (4,'I Wonder'),
  (5,'Good Life'), (6,'Can''t Tell Me Nothing'), (7,'Barry Bonds'),
  (8,'Drunk and Hot Girls'), (9,'Flashing Lights'), (10,'Everything I Am'),
  (11,'The Glory'), (12,'Homecoming'), (13,'Big Brother')
) as t(n, title);

-- 4. 808s & Heartbreak (2008)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('808s & Heartbreak', 2008, 4) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Say You Will'), (2,'Welcome to Heartbreak'), (3,'Heartless'), (4,'Amazing'),
  (5,'Love Lockdown'), (6,'Paranoid'), (7,'RoboCop'), (8,'Street Lights'),
  (9,'Bad News'), (10,'See You in My Nightmares'), (11,'Coldest Winter')
) as t(n, title);

-- 5. My Beautiful Dark Twisted Fantasy (2010)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('My Beautiful Dark Twisted Fantasy', 2010, 5) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Dark Fantasy'), (2,'Gorgeous'), (3,'Power'), (4,'All of the Lights'),
  (5,'Monster'), (6,'So Appalled'), (7,'Devil in a New Dress'), (8,'Runaway'),
  (9,'Hell of a Life'), (10,'Blame Game'), (11,'Lost in the World'),
  (12,'Who Will Survive in America')
) as t(n, title);

-- 6. Yeezus (2013)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Yeezus', 2013, 6) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'On Sight'), (2,'Black Skinhead'), (3,'I Am a God'), (4,'New Slaves'),
  (5,'Hold My Liquor'), (6,'I''m In It'), (7,'Blood on the Leaves'),
  (8,'Guilt Trip'), (9,'Send It Up'), (10,'Bound 2')
) as t(n, title);

-- 7. The Life of Pablo (2016)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('The Life of Pablo', 2016, 7) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Ultralight Beam'), (2,'Father Stretch My Hands, Pt. 1'),
  (3,'Father Stretch My Hands, Pt. 2'), (4,'Famous'), (5,'Feedback'),
  (6,'Low Lights'), (7,'Highlights'), (8,'Freestyle 4'), (9,'I Love Kanye'),
  (10,'Waves'), (11,'FML'), (12,'Real Friends'), (13,'Wolves'),
  (14,'Silver Surfer Intermission'), (15,'Facts'), (16,'Fade'),
  (17,'No More Parties in LA'), (18,'30 Hours'), (19,'Saint Pablo')
) as t(n, title);

-- 8. Ye (2018)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Ye', 2018, 8) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'I Thought About Killing You'), (2,'Yikes'), (3,'All Mine'),
  (4,'Wouldn''t Leave'), (5,'No Mistakes'), (6,'Ghost Town'), (7,'Violent Crimes')
) as t(n, title);

-- 9. Jesus Is King (2019)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Jesus Is King', 2019, 9) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Every Hour'), (2,'Selah'), (3,'Follow God'), (4,'Closed on Sunday'),
  (5,'On God'), (6,'Everything We Need'), (7,'Water'), (8,'God Is'),
  (9,'Hands On'), (10,'Use This Gospel'), (11,'Jesus Is Lord')
) as t(n, title);

-- 10. Donda (2021)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Donda', 2021, 10) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Donda Chant'), (2,'Jail'), (3,'God Breathed'), (4,'Off the Grid'),
  (5,'Hurricane'), (6,'Praise God'), (7,'Jonah'), (8,'Ok Ok'), (9,'Junya'),
  (10,'Believe What I Say'), (11,'24'), (12,'Remote Control'), (13,'Moon'),
  (14,'Heaven and Hell'), (15,'Donda'), (16,'Keep My Spirit Alive'),
  (17,'Jesus Lord'), (18,'New Again'), (19,'Tell the Vision'),
  (20,'Lord I Need You'), (21,'Pure Souls'), (22,'Come to Life'),
  (23,'No Child Left Behind')
) as t(n, title);

-- 11. Donda 2 (2022 / streaming release 2025)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Donda 2', 2022, 11) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'True Love'), (2,'Broken Road'), (3,'Get Lost'), (4,'Sci Fi'),
  (5,'Too Easy'), (6,'Security'), (7,'Happy'), (8,'Pablo'),
  (9,'We Did It Kid'), (10,'City of Gods'), (11,'Louie Bags'), (12,'Forever Rollin''')
) as t(n, title);

-- 12. Vultures 1 (2024, ¥$ with Ty Dolla Sign)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Vultures 1', 2024, 12) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Stars'), (2,'Keys to My Life'), (3,'Paid'), (4,'Talking'),
  (5,'Back to Me'), (6,'Hoodrat'), (7,'Do It'), (8,'Paperwork'), (9,'Burn'),
  (10,'Fuk Sumn'), (11,'Vultures'), (12,'Carnival'), (13,'Beg Forgiveness'),
  (14,'Problematic'), (15,'King')
) as t(n, title);

-- 13. Vultures 2 (2024, ¥$ with Ty Dolla Sign)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Vultures 2', 2024, 13) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Slide'), (2,'River'), (3,'Time Moving Slow'), (4,'Bomb'),
  (5,'Dead'), (6,'Forever')
) as t(n, title);

-- 14. Bully (2026)
with a as (
  insert into public.albums (title, release_year, sort_order) values ('Bully', 2026, 14) returning id
)
insert into public.songs (album_id, title, track_number)
select a.id, t.title, t.n from a, (values
  (1,'Sisters and Brothers'), (2,'Whatever Works'), (3,'Father'),
  (4,'All the Love'), (5,'I Can''t Wait'), (6,'Bully'), (7,'Mama''s Favorite'),
  (8,'Punch Drunk'), (9,'This a Must'), (10,'Outside'), (11,'Preacher Man'),
  (12,'White Lines'), (13,'Circles'), (14,'This One Here'), (15,'King'),
  (16,'Beauty and the Beast'), (17,'Damn'), (18,'Last Breath')
) as t(n, title);
