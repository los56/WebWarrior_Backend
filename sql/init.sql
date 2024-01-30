CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    create_date TIMESTAMP NOT NULL,
    password_change_date TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contents JSON NOT NULL,
    create_date TIMESTAMP NOT NULL,
    modify_date TIMESTAMP,
    writer INTEGER NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY(writer) REFERENCES "users"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    contents VARCHAR NOT NULL,
    create_date TIMESTAMP NOT NULL,
    post_id INTEGER NOT NULL,
    writer INTEGER NOT NULL,
    parent_id INTEGER,
    CONSTRAINT fk_post_id FOREIGN KEY(post_id) REFERENCES "posts"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY(writer) REFERENCES "users"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    level INTEGER NOT NULL,
    exp BIGINT NOT NULL, 
    atk INT NOT NULL,
    magic_atk INT NOT NULL,
    def INT NOT NULL,
    magic_def INT NOT NULL,
    stat_point INT NOT NULL,
    create_date TIMESTAMP NOT NULL,
    owner INTEGER NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY(owner) REFERENCES "users"(id) ON DELETE CASCADE ON UPDATE CASCADE
);