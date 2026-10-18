-- run once as the admin/root user

CREATE USER IF NOT EXISTS 'lab5_writer'@'%' IDENTIFIED BY 'joanthan_writer';
GRANT CREATE, INSERT, SELECT ON railway.* TO 'lab5_writer'@'%';

CREATE USER IF NOT EXISTS 'lab5_reader'@'%' IDENTIFIED BY 'client_reader';
GRANT SELECT ON railway.* TO 'lab5_reader'@'%';
