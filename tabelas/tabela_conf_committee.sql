create table conf_committee
(
	idCommitteeMember int not null,
	idConference int not null,
	constraint conf_committee_committee_idCommitteeMember_fk
		foreign key (idCommitteeMember) references committee (idCommitteeMember),
	constraint conf_committee_conference_idConference_fk
		foreign key (idConference) references conference (idConference)
);
