/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/init.sql


CREATE EXTENSION


CREATE EXTENSION


2025-11-01 14:01:23.198 UTC [61] ERROR: relation "categories" does not exist


2025-11-01 14:01:23.198 UTC [61] STATEMENT: CREATE TABLE IF NOT EXISTS items (


id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),


code TEXT UNIQUE NOT NULL,


name TEXT NOT NULL,


category_id UUID REFERENCES categories(id),


unit_id UUID NOT NULL REFERENCES units(id),


quantity INTEGER,


status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),


created_by UUID REFERENCES users(id),


created_at TIMESTAMPTZ NOT NULL DEFAULT now(),


updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),


deleted_at TIMESTAMPTZ


);


psql:/docker-entrypoint-initdb.d/init.sql:42: ERROR: relation "categories" does not exist