CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE login_logs (
    username TEXT,
    status TEXT,
    user_agent TEXT,
    ip TEXT
);

INSERT INTO users VALUES ("secretuser","f25a2fc72690b780b2a14e140ef6a9e0");