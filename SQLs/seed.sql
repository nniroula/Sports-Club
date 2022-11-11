INSERT INTO players(first_name, last_name, email, birth_date, phone_number, emergency_contact, 
                        -- profile_picture_url, 
                        playing_role, registered_date)
        VALUES ('Nabin', 'Niroula', 'me@gmail.com', '05/08/2000', '720-000-0000', 'No emergency contact',
    --    leave profile picture url 
    'all rounder',
    '07/20/2020'
);


INSERT INTO players(first_name, 
                        last_name, 
                        email, 
                        birth_date, 
                        phone_number, 
                        emergency_contact, 
                        -- profile_picture_url,
                        playing_role, 
                        registered_date)
    VALUES ('Nk',
            'Bhaie',
            'learnse@gmail.com',
            '03/23/1952',
            '110-000-0011',
            'management',
            --    leave profile picture url 
            'batsman',
            '07/20/2020'
    );

-- users table
INSERT INTO users(first_name, last_name, username, password, email, phone_number, is_admin, start_date)
VALUES('John', 'Doe', 'jd', 'aeccPass', 'jd@gmail.com', '720-123-4567', TRUE, '10/18/2022');


-- INSERT INTO users(first_name, last_name, username, password, email, phone_number, is_admin, start_date)
-- VALUES('AECC', 'ROOT', 'root', 'aeccPass', 'nn@gmail.com', '720-000-0000', 'true', '05/24/1987');
INSERT INTO users(first_name, last_name, username, password, email, phone_number, is_admin, start_date)
VALUES('AECC', 'ROOT', 'root', '$2b$12$hzSVAe6FyFlZ7o/TkQd3h.0BcwwJc9iWBoRm53AmIIi4znd70b2DC', 'nn@gmail.com', '720-000-0000', 'true', '05/24/1987');

INSERT INTO users(first_name, last_name, username, password, email, phone_number, is_admin)
VALUES('Joe', 'Biden', 'je', 'aeccPass', 'se@gmail.com', '720-010-0000', 'false');