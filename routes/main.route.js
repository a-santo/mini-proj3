const router = require('express').Router();
const controllerSpeaker = require('../controllers/speaker.controller.js');
const controllerSponsor = require('../controllers/sponsor.controller.js');
const controllerConference = require('../controllers/conference.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
const controllerCommittee = require('../controllers/committee.controller');
const controllerVolunteer = require('../controllers/volunteers.controller');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
router.get('/', function(req, res) {
    res.send("FCA Book");
    res.end();
});

router.get('/speakers/', controllerSpeaker.read);
router.get('/speakers/:id', controllerSpeaker.readID);
router.post('/speakers/', isLoggedIn, controllerSpeaker.save);
router.put('/speakers/:id', isLoggedIn, isLoggedIn, controllerSpeaker.update);
router.put('/speakers/del/:id', isLoggedIn, controllerSpeaker.deleteL);
router.delete('/speakers/:id', isLoggedIn, controllerSpeaker.deleteF);

router.get('/sponsors/', controllerSponsor.read);
router.get('/sponsors/:id', controllerSponsor.readID);
router.post('/sponsors/', isLoggedIn, controllerSponsor.save);
router.put('/sponsors/:id', isLoggedIn, controllerSponsor.update);
router.put('/sponsors/del/:id', isLoggedIn, controllerSponsor.deleteL);
router.delete('/sponsors/:id', isLoggedIn, controllerSponsor.deleteF);

router.get('/conferences', controllerConference.readConference);
router.get('/conferences/:id', controllerConference.readConferenceID);

router.get('/conferences/:idconf/participants', controllerConference.readParticipant);
router.post('/conferences/:idconf/participants/:idparticipant/', controllerConference.saveParticipant);
router.delete('/conferences/:idconf/participants/:idparticipant', controllerConference.deleteParticipant);

router.get('/conferences/:idconf/sponsors/', controllerConference.readSponsor);
router.post('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.saveSponsor);
router.delete('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.deleteSponsor);

router.get('/conferences/:idconf/speakers/', controllerConference.readSpeaker);
router.post('/conferences/:idconf/speakers/:idspeaker', isLoggedIn, controllerConference.saveSpeaker);
router.delete('/conferences/:idconf/speakers/:idspeaker', controllerConference.deleteSpeaker);

router.post('/contacts/emails', controllerMail.send);

// comité
router.post('/committee', controllerCommittee.save); //inserir membro do comité
router.get('/committee/', controllerCommittee.read); //ler a info de todos os membros do comité
router.get('/committee/:id', controllerCommittee.readID); //ler a info de um membro do comité (por id)
router.put('/committee/:id', controllerCommittee.updateMember); //atualizar membro do comité
router.delete('/committee/:id', controllerCommittee.deleteMember); //apagar membro do comité

//conferência comité
router.get('/conferences/:idconf/committee/', controllerConference.readCommittee); // ler todos os membros do comité da conferência X
router.post('/conferences/:idconf/committee/:idcommitteemember', controllerConference.saveCommitteeMember); //adicionar membro do comité X à conferência X
router.delete('/conferences/:idconf/committee/:idcommitteemember', controllerConference.deleteConfCommitteeMember); //apagar membro do comité X da conferência X

//voluntários
router.post('/volunteers', controllerVolunteer.save); //inserir voluntário
router.get('/volunteers/', controllerVolunteer.read); //ler a info de todos voluntários
router.get('/volunteers/:id', controllerVolunteer.readID); //ler a info de voluntário (por id)
router.put('/volunteers/:id', controllerVolunteer.updateVolunteer); //atualizar voluntário
router.delete('/volunteers/:id', controllerVolunteer.deleteVolunteer); //apagar voluntário

//conferência voluntários
router.get('/conferences/:idconf/volunteers/', controllerConference.readVolunteer); // ler todos os voluntários da conferência X
router.post('/conferences/:idconf/volunteers/:idvolunteer', controllerConference.saveVolunteer); //adicionar voluntário X à conferência X
router.delete('/conferences/:idconf/volunteers/:idvolunteer', controllerConference.deleteVolunteer); //apagar voluntário X da conferência X


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
