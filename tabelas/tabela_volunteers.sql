create table volunteers
(
	idVolunteer int auto_increment,
	nome varchar(255) null,
	telefone bigint null,
	foto varchar(255) null,
	constraint volunteers_pk
		primary key (idVolunteer)
); 
