2025-11-11 02:07:07.523 UTC [67] ERROR: column "unit_price" of relation "items" does not exist at character 18


2025-11-11 02:07:07.523 UTC [67] STATEMENT: UPDATE items SET unit_price = 50 WHERE code = 'HSM-0001';


psql:/docker-entrypoint-initdb.d/03_initial_data.sql:324: ERROR: column "unit_price" of relation "items" does not exist


LINE 1: UPDATE items SET unit_price = 50 WHERE code = 'HSM-0001';