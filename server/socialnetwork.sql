DROP TABLE IF EXISTS resetcodes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first <> ''),
    last VARCHAR NOT NULL CHECK (last <> ''),
    email VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    hashpass VARCHAR NOT NULL CHECK (hashpass <> ''),
    imgurl TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resetcodes (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR NOT NULL REFERENCES users(email),
    dcode VARCHAR NOT NULL CHECK (dcode <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);