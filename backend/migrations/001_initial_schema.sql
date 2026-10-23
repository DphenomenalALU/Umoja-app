CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  kind text NOT NULL CHECK (kind IN ('meeting', 'volunteer')),
  starts_at timestamptz NOT NULL,
  venue text NOT NULL CHECK (char_length(venue) BETWEEN 2 AND 180),
  agenda text NOT NULL DEFAULT '' CHECK (char_length(agenda) <= 4000),
  capacity integer CHECK (capacity BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'volunteer' AND capacity IS NOT NULL) OR (kind = 'meeting' AND capacity IS NULL))
);

CREATE TABLE signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  signed_up_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, person_id)
);

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL UNIQUE REFERENCES signups(id) ON DELETE CASCADE,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  volunteer_hours numeric(5, 2) NOT NULL DEFAULT 0 CHECK (volunteer_hours BETWEEN 0 AND 24)
);

CREATE INDEX events_starts_at_idx ON events(starts_at);
CREATE INDEX signups_event_status_idx ON signups(event_id, status);
CREATE INDEX signups_person_id_idx ON signups(person_id);
CREATE INDEX people_email_idx ON people(lower(email));
