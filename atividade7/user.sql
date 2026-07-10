USE DATABASE ProgIV;

CREATE TABLE IF NOT EXISTS user  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome varchar(30) NOT NULL,
    idade INT,
    CHECK (idade >= 0)
);

INSERT INTO user (nome, idade) VALUES ('joão Paulo', 21), ('Liana Grow', 21);