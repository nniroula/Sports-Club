/* creates database tables */

DROP TABLE IF EXISTS players;

CREATE TABLE players (
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
     -- username VARCHAR(25) PRIMARY KEY,
    -- password TEXT NOT NULL,
    email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
    -- is_admin BOOLEAN NOT NULL DEFAULT FALSE
    birth_date TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    profile_picture_url TEXT,
    playing_role TEXT,
    registered_date TEXT NOT NULL
    -- exit_date TEXT NOT NULL
);
