module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var user = schema({

        uid: { type: String, unique: true, riquered: true },
        name: { type: String, riquered: true },
        email: { type: String, unique: true, required: true },
        birthday: { type: String, required: false },
        pic: { type: String, required: true },
        firebaseUid: { type: String, required: true },
        link: { type: String, required: false },

    }, { usePushEach: true });

    return db.model('user', user);
}

