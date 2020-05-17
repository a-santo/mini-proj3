create table committee
(
	idCommitteeMember int auto_increment,
	nome varchar(255) null,
	email varchar(255) null,
	telefone bigint null,
	foto varchar(255) null,
	instituicao varchar(255) null,
	profissao varchar(255) null,
	constraint committee_pk
		primary key (idCommitteeMember)
);
