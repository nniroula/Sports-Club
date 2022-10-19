/* creates database tables */

DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    birth_date TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    emergency_contact TEXT NOT NULL,
    profile_picture_url TEXT,
    playing_role TEXT,
    registered_date TEXT NOT NULL
);
