const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
//const connect = require('../config/connectMySQL');
const dataConf = require('../tabelas/conference.json');
const dataConfCom = require('../tabelas/conf_committee.json');
const dataConfVol = require('../tabelas/conf_volunteers.json');
const dataCommittee = require('../tabelas/committee.json');
const dataVolunteers = require('../tabelas/volunteers.json');
const fs = require("fs");
//função de leitura que retorna o resultado no callback
function readConference(req, res) {
    const query = connect.con.query('SELECT idConference, acronimo, nome, descricao, local, data FROM conference order by data desc', function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function readConferenceID(req, res) {
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
    const query = connect.con.query('SELECT idConference, acronimo, nome,descricao,local,data FROM conference where ? order by data desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function readParticipant(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct idParticipant, nomeParticipante FROM conf_participant where ? order by idParticipant desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveParticipant(req, res) {
    //receber os dados do formulário que são enviados por post
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idParticipant = req.params.idparticipant;
        const idConf = req.params.idconf;
        const nome = req.body.nomeparticipant;
        if (idParticipant != "NULL" && idConf != "NULL" && typeof(idParticipant) != 'undefined' && typeof(idConf) != 'undefined') {
            const post = { idParticipant: idParticipant, idConference: idConf, nomeParticipante: nome };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO conf_participant SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    if (err.code == "ER_DUP_ENTRY") {
                        res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
                    }
                    else
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function deleteConfParticipant(req, res) {
    //criar e executar a query de leitura na BD
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idconference = req.params.idconf;
        const idparticipant = req.params.idparticipant;
        const params = [idconference, idparticipant];
        const query = connect.con.query('DELETE FROM conf_participant where idConference = ? and idParticipant = ?', params, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
}

function readConfSponsor(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct sponsor.idSponsor, nome, logo,categoria, link, active FROM sponsor, conf_sponsor where ? order by idSponsor desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            console.log(err);
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveConfSponsor(req, res) {
    //receber os dados do formuário que são enviados por post
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf');
    if (idSponsor != "NULL" && idConf != "NULL" && typeof(idSponsor) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSponsor: idSponsor, idConference: idConf };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
    else
        res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
}

function deleteConfSponsor(req, res) {
    //criar e executar a query de leitura na BD
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf').escape();
    const params = [idConf, idSponsor];
    const query = connect.con.query('DELETE FROM conf_sponsor where idConference = ? and idSponsor = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function readConfSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
    const query = connect.con.query('SELECT distinct a.idSpeaker, nome, foto, bio,link, filiacao, linkedin,twitter,facebook, cargo, active FROM speaker a, conf_speaker b where a.idSpeaker = b.idSpeaker  and ? order by idSpeaker desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveConfSpeaker(req, res) {
    //receber os dados do formuário que são enviados por post
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    if (idSpeaker != "NULL" && idConf != "NULL" && typeof(idSpeaker) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSpeaker: idSpeaker, idConference: idConf };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_speaker SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
    else
        res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
}

function deleteConfSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    const params = [idConf, idSpeaker];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_speaker where idConference = ? and idSpeaker = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function readConfCommittee(req, res) {
    const idconference = parseInt(req.sanitize('idconf').escape());
    var confIndex = findConf(idconference);
    if(confIndex || confIndex === 0) {
        var resultados = []
        dataConfCom.forEach(function (element, i) {
            const membroIndex = findComM(element.idCommitteeMember)
            if (membroIndex || membroIndex === 0) { resultados.push(dataCommittee[membroIndex]) }
        });
        if(resultados.length === 0) {
            res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
        } else {
            res.send(resultados);
        }

    } else {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
}

function saveConfCommitteeMember(req, res) {
    const idConf = parseInt(req.sanitize('idconf').escape());
    const idCommitteeMember = parseInt(req.sanitize('idcommitteemember').escape());

    var confIndex = findConf(idConf);
    var membroIndex = findComM(idCommitteeMember);

    //se já existir a relação conferência/voluntário, não voltar a inserir
    var dupeCheck = findDupConfCom(idConf, idCommitteeMember)
    if(dupeCheck) { return res.send(jsonMessages.db.duplicateData); }

    if((confIndex || confIndex === 0) && (membroIndex || membroIndex === 0)) {
        dataConfCom.push({
            "idCommitteeMember": dataCommittee[membroIndex].idCommitteeMember,
            "idConference": dataConf[confIndex].idConference
        });
        fs.writeFile("./tabelas/conf_committee.json", JSON.stringify(dataConfCom), err => {
            if (err) throw res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
        });

    } else {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
}

function deleteConfCommitteeMember(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = parseInt(req.sanitize('idconf').escape());
    const idCommitteeMember = parseInt(req.sanitize('idcommitteemember').escape());

    var found = false;

    // procurar membro com o ID especificado
    dataConfCom.forEach(function (element, i) {
        if (element.idConference === idConf && element.idCommitteeMember === idCommitteeMember) {
            found = true;
            dataConfCom.splice(i,1);
            fs.writeFile("./tabelas/conf_committee.json", JSON.stringify(dataConfCom), err => {
                if (err) throw err;
            });
            return res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
    });
    if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }
}

function readConfVolunteer(req, res) {
    const idconference = parseInt(req.sanitize('idconf').escape());
    var confIndex = findConf(idconference);
    if(confIndex || confIndex === 0) {
        var resultados = []
        dataConfVol.forEach(function (element, i) {
            const volIndex = findVol(element.idVolunteer)
            if (volIndex || volIndex === 0) { resultados.push(dataVolunteers[volIndex]) }
        });
        if(resultados.length === 0) {
            res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
        } else {
            res.send(resultados);
        }

    } else {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
}

function saveConfVolunteer(req, res) {

    const idConf = parseInt(req.sanitize('idconf').escape());
    const idVolunteer = parseInt(req.sanitize('idvolunteer').escape());

    var confIndex = findConf(idConf);
    var volIndex = findVol(idVolunteer);

    //se já existir a relação conferência/voluntário, não voltar a inserir
    var dupeCheck = findDupConfVol(idConf, idVolunteer)
    if(dupeCheck) { return res.send(jsonMessages.db.duplicateData); }

    if((confIndex || confIndex === 0) && (volIndex || volIndex === 0)) {
        dataConfCom.push({
            "idVolunteer": dataVolunteers[volIndex].idVolunteer,
            "idConference": dataConf[confIndex].idConference
        });
        fs.writeFile("./tabelas/conf_volunteers.json", JSON.stringify(dataConfCom), err => {
            if (err) throw res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
        });

    } else {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
}

function deleteConfVolunteer(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = parseInt(req.sanitize('idconf').escape());
    const idVolunteer = parseInt(req.sanitize('idvolunteer').escape());

    var found = false;

    // procurar membro com o ID especificado
    dataConfVol.forEach(function (element, i) {
        if (element.idConference === idConf && element.idVolunteer === idVolunteer) {
            found = true;
            dataConfVol.splice(i,1);
            fs.writeFile("./tabelas/conf_volunteers.json", JSON.stringify(dataConfVol), err => {
                if (err) throw err;
            });
            return res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
    });
    if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }
}

// funções auxiliares para encontrar conferência, membro do comité, voluntário por id e para verificar se os
// dados a inserir nas "tabelas" relacionais conf_volunteers e conf_committee e evitar duplicação de dados
function findConf(idConf) {
    for (var i = 0; i < dataConf.length; i++) {
        if (dataConf[i].idConference === idConf) {
            return i
        }
    }
    return null
}

function findComM(idMembro) {
    for (var i = 0; i < dataCommittee.length; i++) {
        if (dataCommittee[i].idCommitteeMember === idMembro) {
            return i
        }
    }
    return null
}

function findVol(idVol) {
    for (var i = 0; i < dataVolunteers.length; i++) {
        if (dataVolunteers[i].idVolunteer === idVol) {
            return i
        }
    }
    return null
}

function findDupConfCom(idConf, idComM) {
    for (var i = 0; i < dataConfCom.length; i++) {
        if (dataConfCom[i].idCommitteeMember === idComM && dataConfCom[i].idConference === idConf) {
            return true
        }
    }
    return  false
}

function findDupConfVol(idConf, idVol) {
    for (var i = 0; i < dataConfVol.length; i++) {
        if (dataConfVol[i].idVolunteer === idVol && dataConfVol[i].idConference === idConf) {
            return true
        }
    }
    return  false
}

//exportar as funções
module.exports = {
    readConference: readConference,
    readConferenceID: readConferenceID,
    readParticipant: readParticipant,
    saveParticipant: saveParticipant,
    readSponsor: readConfSponsor,
    saveSponsor: saveConfSponsor,
    readSpeaker: readConfSpeaker,
    saveSpeaker: saveConfSpeaker,
    deleteSpeaker: deleteConfSpeaker,
    deleteSponsor: deleteConfSponsor,
    deleteParticipant: deleteConfParticipant,
    readCommittee: readConfCommittee,
    saveCommitteeMember: saveConfCommitteeMember,
    deleteConfCommitteeMember: deleteConfCommitteeMember,
    readVolunteer: readConfVolunteer,
    saveVolunteer: saveConfVolunteer,
    deleteVolunteer: deleteConfVolunteer
};
