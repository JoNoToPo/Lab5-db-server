-- run once as the admin/root user


CREATE DATABASE IF NOT EXISTS lab5db;

CREATE USER IF NOT EXISTS 'lab5_writer'@'localhost' IDENTIFIED BY 'joanthan_writer';
GRANT CREATE, INSERT, SELECT ON lab5db.* TO 'lab5_writer'@'localhost';

CREATE USER IF NOT EXISTS 'lab5_reader'@'localhost' IDENTIFIED BY 'client_reader';
GRANT SELECT ON lab5db.* TO 'lab5_reader'@'localhost';

FLUSH PRIVILEGES;