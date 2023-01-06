/* creates database tables */

DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS games;

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


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username VARCHAR(25) NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    phone_number TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    start_date TEXT 
);

CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    game_date TEXT NOT NULL,
    venue VARCHAR(50) NOT NULL,
    opposition_team VARCHAR(50) NOT NULL,
    game_time TEXT NOT NULL
);
