create table conf_volunteers
(
	idVolunteer int null,
	idConference int null,
	constraint conf_volunteers_conference_idConference_fk
		foreign key (idConference) references conference (idConference),
	constraint conf_volunteers_volunteers_idVolunteer_fk
		foreign key (idVolunteer) references volunteers (idVolunteer)
);

 
