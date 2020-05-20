const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
//const connect = require('../config/connectMySQL');
const data = require('../tabelas/volunteers.json');
const fs = require("fs");

function save(req, res) {
    const nome = req.sanitize('nome').escape();
    const telefone = parseInt(req.sanitize('telefone').escape());
    const foto = req.sanitize('foto').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[\w]+|[^\u0000-\u007F]+$/i);
    req.checkBody("telefone", "Insira número válido.").matches(/^[0-9]*$/i);
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && telefone != "NULL" && typeof(nome) != "undefined") {
            const novoID = data[data.length-1].idVolunteer + 1
            const post = {
                idVolunteer: novoID,
                nome: nome,
                telefone: telefone,
                foto: foto
            };
            data.push(post);
            fs.writeFile("./tabelas/volunteers.json", JSON.stringify(data), err => {
                if (err) throw err;
                res.status(jsonMessages.db.successInsert.status).location(novoID).send(jsonMessages.db.successInsert);
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function read(req, res) {
    if (data.length === 0) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    } else {
        res.send(data);
    }
}

function readID(req, res) {
    const idVolunteer = parseInt(req.sanitize('id').escape());
    var found = false;

    // procurar membro com o ID especificado
    data.forEach(element => {
        if (element.idVolunteer === idVolunteer) {
            found = true;
            return res.status(200).send(element)
        }
    });

    if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }
}

function updateV(req, res) {
    const idVolunteer = parseInt(req.sanitize('id').escape());
    const nome = req.sanitize('nome').escape();
    const telefone = req.sanitize('telefone').escape();
    const foto = req.sanitize('foto').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[\w]+|[^\u0000-\u007F]+$/i);
    req.checkBody("telefone", "Insira número válido.").matches(/^[0-9]*$/i);
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    else if (idVolunteer != "NULL" && typeof(nome) != 'undefined' && typeof(telefone) != 'undefined' && typeof(idVolunteer) != 'undefined') {
        var found = false;
        // procurar membro com o ID especificado
        data.forEach(element => {
            if (element.idVolunteer === idVolunteer) {
                found = true;
                element.nome = nome;
                element.telefone = telefone;
                element.foto = foto;
                fs.writeFile("./tabelas/volunteers.json", JSON.stringify(data), err => {
                    if (err) throw err;
                });
                res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
            }
        });
        if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }
    } else {
        res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function deleteV(req, res) {
    const idVolunteer = parseInt(req.sanitize('id').escape())
    var found = false;
    // procurar membro com o ID especificado
    data.forEach(function (element, i) {
        if (element.idVolunteer === idVolunteer) {
            found = true;
            data.splice(i,1);
            fs.writeFile("./tabelas/volunteers.json", JSON.stringify(data), err => {
                if (err) throw err;
            });
            return res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
    });

    if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }
}

module.exports = {
    save: save,
    read: read,
    readID: readID,
    updateVolunteer: updateV,
    deleteVolunteer: deleteV
};