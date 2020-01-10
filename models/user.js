module.exports = function (app) {

    var schema = require('mongoose').Schema;

    var user = schema({

        uid: { type: String, unique: true, riquered: true },
        name: { type: String, riquered: true },
        email: { type: String, unique: true, required: true },
        pic: { type: String, required: true }
    
    }, { usePushEach: true });

    return db.model('user', user);
}