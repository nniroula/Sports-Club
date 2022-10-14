-- \echo 'Delete and recreate aecc db?'
-- \prompt 'Hit Enter Key for yes or press control-C to cancel > ' foo

-- DROP DATABASE aecc_db;
DROP DATABASE IF EXISTS aecc_db;
CREATE DATABASE aecc_db;
\connect aecc_db;

\i dbSchemas.sql;
\i seed.sql

-- \echo 'Delete and recreate aecc_test db?'
-- \prompt 'Hit Enter key for yes or press control-C to cancel > ' foo

-- DROP DATABASE aecc_test;
DROP DATABASE IF EXISTS aecc_test_db;
CREATE DATABASE aecc_test_db;
\connect aecc_test_db

\i dbSchemas.sql
