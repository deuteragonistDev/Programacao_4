Create table if not exists User
(
id int auto_increment primary key,
nome varchar(30),
idade int not null,
email varchar(120),
senha varchar(120)
);

insert into User (nome, idade, email, senha) values 
('joão paulo alves', 20, 'joaopaulo080406@gmail.com', 'senha123#'), 
('luana G', 22, 'luanaG@gmail.com', 'senha321#');