-- ============================================================
-- SEED DATA - SIS3
-- Run migration.sql first before running this file
-- ============================================================

-- USERS (passwords are stored as plain text matching the app)
INSERT INTO users (username, email, password, role) VALUES
    ('admin',    'admin@sis3.com',    'admin123',    'admin'),
    ('employee1','employee@sis3.com', 'emp123',      'employee'),
    ('marko',    'marko@mail.com',    'marko123',    'user'),
    ('ana',      'ana@mail.com',      'ana123',      'user');

-- PROGRAMS
INSERT INTO programs (title, description, difficulty, created_by, created_at) VALUES
    ('Mass Gain Program',   'Program za nabacivanje mase i povecanje misicne mase uz pravilnu ishranu.', 'Hard',   'admin', NOW()),
    ('Fat Loss Program',    'Program za skidanje viska kilograma uz kardio i dijetu.',                   'Medium', 'admin', NOW()),
    ('Strength Builder',    'Program za povecanje snage kroz tezak trening sa utezima.',                 'Hard',   'admin', NOW()),
    ('Beginner Gym Plan',   'Pocetnicki plan za osobe koje tek pocuju sa tjelovjezbom.',                 'Easy',   'employee1', NOW()),
    ('Summer Shred',        'Program za definiciju tijela prije ljeta.',                                 'Medium', 'employee1', NOW()),
    ('Functional Fitness',  'Trening za poboljsanje mobilnosti, koordinacije i kondicije.',              'Easy',   'admin', NOW());

-- PROGRAM RATINGS (user id 3 = marko, user id 4 = ana)
INSERT INTO program_ratings (program_id, user_id, rating) VALUES
    (1, 3, 5),
    (1, 4, 4),
    (2, 3, 4),
    (2, 4, 5),
    (3, 3, 3),
    (4, 4, 5),
    (5, 3, 4),
    (6, 4, 3);

-- MEMBERS
INSERT INTO members (name, surname, start_date, end_date) VALUES
    ('Marko',   'Maric',    '2026-06-01', '2026-07-01'),
    ('Ana',     'Anic',     '2026-06-10', '2026-07-10'),
    ('Ivan',    'Ivanic',   '2026-05-15', '2026-06-15'),
    ('Petra',   'Petric',   '2026-06-20', '2026-07-20'),
    ('Luka',    'Lukic',    '2026-04-01', '2026-05-01');

-- BLOG POSTS
INSERT INTO blog_posts (title, content, pdf_url, created_by) VALUES
    ('Kako se pravilno zagrijati',
     'Zagrijavanje je kljucni dio svakog treninga. Pocnite s laganim kardio vezbamai, a zatim prijedite na dinamicko istezanje kako biste pripremili misice za napor.',
     NULL, 'admin'),
    ('Ishrana za mrsavljenje',
     'Deficit kalorija je osnova mrsavljenja. Fokusirajte se na proteine, smanjite ugljikohidrate navece i pijte dovoljno vode svaki dan.',
     NULL, 'employee1'),
    ('Prednosti funkcionalnog treninga',
     'Funkcionalni trening poboljsava koordinaciju, ravnotezu i snagu u svakodnevnim pokretima. Idealan je za pocetnike i napredne vjezbaće.',
     NULL, 'admin');

-- BLOG COMMENTS
INSERT INTO blog_comments (blog_id, user_id, username, comment, reply, created_at) VALUES
    (1, 3, 'marko', 'Odlican clanak, bas mi je pomoglo!', 'Hvala, drago nam je!', NOW()),
    (1, 4, 'ana',   'Nisam znala da je zagrijavanje toliko vazno.', NULL, NOW()),
    (2, 3, 'marko', 'Imate li preporuku za plan obroka?', 'Da, uskoro objavljujemo clanak o tome!', NOW()),
    (3, 4, 'ana',   'Pocela sam funkcionalni trening i osjecam se odlicno!', NULL, NOW());

-- FORUM THREADS
INSERT INTO forum_threads (title, content, user_id, username, created_at) VALUES
    ('Koji protein preporucujete?',
     'Trazim dobar whey protein, ima li iskustva s nekim brendovima?',
     3, 'marko', NOW()),
    ('Bol u koljenu pri cucnju',
     'Imam bol u koljenu kad radim cucanj, da li da nastavim ili pauzirati?',
     4, 'ana', NOW()),
    ('Motivacija za trening',
     'Kako se motivirate kada vam se ne da ici na trening?',
     3, 'marko', NOW());

-- FORUM POSTS (replies)
INSERT INTO forum_posts (thread_id, user_id, username, content, created_at) VALUES
    (1, 4, 'ana',       'Koristim Optimum Nutrition Gold Standard, preporucujem!', NOW()),
    (1, 2, 'employee1', 'MyProtein Impact Whey je odlican omjer cijene i kvalitete.', NOW()),
    (2, 2, 'employee1', 'Pauzirati i javite se treneru da provjeri tehniku cucnja.', NOW()),
    (2, 3, 'marko',     'I meni se desilo isto, ispostavilo se da je losа tehnika.', NOW()),
    (3, 4, 'ana',       'Nalazim partnera za trening, puno lakse je!', NOW()),
    (3, 2, 'employee1', 'Postavite sebi male ciljeve i slavite svaki napredak.', NOW());

-- SUBSCRIPTIONS
INSERT INTO subscriptions (user_id, full_name, start_date) VALUES
    (3, 'Marko Maric', '2026-06-01'),
    (4, 'Ana Anic',    '2026-06-10');
