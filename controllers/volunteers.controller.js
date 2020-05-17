const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

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
            const post = {
                nome: nome,
                telefone: telefone,
                foto: foto
            };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO volunteers SET ?', post, function(err, rows, fields) {
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
    const query = connect.con.query('SELECT idVolunteer, nome, telefone, foto FROM volunteers order by idVolunteer desc', function(err, rows, fields) {
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
    const idVolunteer = req.sanitize('id').escape();
    const post = { idVolunteer: idVolunteer };
    const query = connect.con.query('SELECT idVolunteer, nome, telefone, foto FROM volunteers where ? order by idVolunteer desc', post, function(err, rows, fields) {
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
    else {
        if (idVolunteer != "NULL" && typeof(nome) != 'undefined' && typeof(telefone) != 'undefined' && typeof(idVolunteer) != 'undefined') {
            const update = [nome, telefone, foto, idVolunteer];
            const query = connect.con.query('UPDATE volunteers SET nome =?, telefone=?, foto=? WHERE idVolunteer=?', update, function(err, rows, fields) {
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

function deleteV(req, res) {
    const update = parseInt(req.sanitize('id').escape())
    const query = connect.con.query('DELETE FROM volunteers WHERE idVolunteer=?', update, function(err, rows, fields) {
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
    updateVolunteer: updateV,
    deleteVolunteer: deleteV
};