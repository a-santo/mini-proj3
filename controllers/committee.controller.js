const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const data = require('../tabelas/committee.json');
const fs = require("fs");
//const connect = require('../config/connectMySQL');

function save(req, res) {
    const nome = req.sanitize('nome').escape();
    const email = req.sanitize('email').escape();
    const telefone = parseInt(req.sanitize('telefone').escape());
    const foto = req.sanitize('foto').escape();
    const instituicao = req.sanitize('instituicao').escape();
    const profissao = req.sanitize('profissao').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[\w]+|[^\u0000-\u007F]+$/i);
    //regex retirado de https://emailregex.com/
    req.checkBody("email", "Insira um endereço de email válido.").matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
    req.checkBody("telefone", "Insira número válido.").matches(/^[0-9]*$/i);
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && email != "NULL" && typeof(nome) != "undefined") {
            const novoID = data[data.length-1].idCommitteeMember + 1
            const post = {
                idCommitteeMember: novoID,
                nome: nome,
                email: email,
                telefone: telefone,
                foto: foto,
                instituicao: instituicao,
                profissao: profissao
            };

            data.push(post);
            fs.writeFile("./tabelas/committee.json", JSON.stringify(data), err => {
                if (err) throw err;
                res.status(jsonMessages.db.successInsert.status).location(novoID).send(jsonMessages.db.successInsert);
            });
            /* DESATIVADA A CHAMADA À BD
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO committee SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            }); */
        } else
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
    const idCommitteeMember = parseInt(req.sanitize('id').escape());
    var found = false;

    // procurar membro com o ID especificado
    data.forEach(element => {
        if (element.idCommitteeMember === idCommitteeMember) {
            found = true;
            return res.status(200).send(element)
        }
    });

    if (!found) { res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords); }

}

function updateM(req, res) {
    const idCommitteeMember = parseInt(req.sanitize('id').escape());
    const nome = req.sanitize('nome').escape();
    const email = req.sanitize('email').escape();
    const telefone = req.sanitize('telefone').escape();
    const foto = req.sanitize('foto').escape();
    const instituicao = req.sanitize('instituicao').escape();
    const profissao = req.sanitize('profissao').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[\w]+|[^\u0000-\u007F]+$/i);
    //regex retirado de https://emailregex.com/
    req.checkBody("email", "Insira um endereço de email válido.").matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
    req.checkBody("telefone", "Insira número válido.").matches(/^[0-9]*$/i);
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else if (idCommitteeMember != "NULL" && typeof(nome) != 'undefined' && typeof(telefone) != 'undefined' && typeof(idCommitteeMember) != 'undefined') {
        var found = false;
        // procurar membro com o ID especificado
        data.forEach(element => {
            if (element.idCommitteeMember === idCommitteeMember) {
                found = true;
                element.name = nome;
                element.email = email;
                element.telefone = telefone;
                element.foto = foto;
                element.instituicao = instituicao;
                element.profissao = profissao;
                fs.writeFile("./tabelas/committee.json", JSON.stringify(data), err => {
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

function deleteM(req, res) {
    const idCommitteeMember = parseInt(req.sanitize('id').escape())

    var found = false;

    // procurar membro com o ID especificado
    data.forEach(function (element, i) {
        if (element.idCommitteeMember === idCommitteeMember) {
            found = true;
            data.splice(i,1);
            fs.writeFile("./tabelas/committee.json", JSON.stringify(data), err => {
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
    updateMember: updateM,
    deleteMember: deleteM
};