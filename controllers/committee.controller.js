const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

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
            const post = {
                nome: nome,
                email: email,
                telefone: telefone,
                foto: foto,
                instituicao: instituicao,
                profissao: profissao
            };
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
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function read(req, res) {
    //criar e executar a query de leitura na BD
    const query = connect.con.query('SELECT idCommitteeMember, nome, email, foto, instituicao, profissao, telefone FROM committee order by idCommitteeMember desc', function(err, rows, fields) {
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

function readID(req, res) {
    const idCommitteeMember = req.sanitize('id').escape();
    const post = { idCommitteeMember: idCommitteeMember };
    connect.con.query('SELECT idCommitteeMember, nome, email, foto, instituicao, profissao, telefone FROM committee where idCommitteeMember = ? order by idCommitteeMember desc', post, function(err, rows, fields) {
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
    else {
        if (idCommitteeMember != "NULL" && typeof(nome) != 'undefined' && typeof(email) != 'undefined' && typeof(idCommitteeMember) != 'undefined') {
            const update = [nome, email, telefone, foto, instituicao, profissao, idCommitteeMember];
            const query = connect.con.query('UPDATE committee SET nome =?, email =?, telefone=?, foto=?, instituicao=?, profissao=? WHERE idCommitteeMember=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
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
}

function deleteM(req, res) {
    const update = parseInt(req.sanitize('id').escape())
    const query = connect.con.query('DELETE FROM committee WHERE idCommitteeMember=?', update, function(err, rows, fields) {
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

module.exports = {
    save: save,
    read: read,
    readID: readID,
    updateMember: updateM,
    deleteMember: deleteM
};