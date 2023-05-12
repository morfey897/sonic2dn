DROP TABLE IF EXISTS User;

CREATE TABLE User (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO
  User (id, name, email, password)
VALUES
  (1, 'Admin', 'admin@sonic2dc.net', 'testAdmin');