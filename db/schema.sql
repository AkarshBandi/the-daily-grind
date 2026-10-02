-- Contact form submissions for Hearth & Honey.
--
-- Created 2026-10-02. Chosen over Workers KV deliberately: KV's free tier
-- allows only 1,000 writes per day, and a contact form is a pure-write
-- workload. A single spam burst would exhaust that quota and then every real
-- enquiry would fail silently while Turnstile was working perfectly.
-- D1 allows far more writes and gives us 7 days of free Time Travel, so a
-- mistake here is recoverable.

CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  intent      TEXT    NOT NULL,          -- 'contact' | 'subscribe'
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  message     TEXT    NOT NULL DEFAULT '',
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER NOT NULL          -- unix seconds
);

CREATE INDEX IF NOT EXISTS submissions_created_at ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_email      ON submissions (email);

-- Rolling-window rate limiting, one row per (ip, window).
CREATE TABLE IF NOT EXISTS rate_limits (
  key           TEXT    PRIMARY KEY,
  count         INTEGER NOT NULL,
  window_start  INTEGER NOT NULL
);

-- Turnstile tokens are single-use. Hashes are kept so that a captured token
-- cannot be replayed against this endpoint. Rows older than a few hours are
-- safe to prune; Cloudflare's own tokens expire in 5 minutes.
CREATE TABLE IF NOT EXISTS seen_tokens (
  token_hash TEXT    PRIMARY KEY,
  seen_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS seen_tokens_seen_at ON seen_tokens (seen_at);