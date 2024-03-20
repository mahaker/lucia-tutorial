CREATE TABLE auth_user (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  address VARCHAR(100) NOT NULL
);

CREATE TABLE user_session (
  id TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  user_id TEXT NOT NULL REFERENCES auth_user(id)
);
