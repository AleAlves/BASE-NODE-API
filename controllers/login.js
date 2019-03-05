module.exports = function (app) {

    const userModel = app.models.user;
    const userObject = app.models.user;
    const cryptoUtil = app.security.crypto;
    const jsonWebToken = require('jwt-simple');

    const LoginController = {

        init: function (req, res) {

            console.log("\ninit\nPublickey: " + cryptoUtil.RSA.publicKey());

            var params = {
                body: cryptoUtil.RSA.publicKey(),
                statusQuo: HTTP_STATUS.SUCESS.OK
            };

            res.send(params);
        },

        ticket: function (req, res) {

            console.log("\nticket\n");

            console.log(JSON.stringify(req.body));

            var ticket = cryptoUtil.RSA.decrypt(req.body.arg0, 'json');

            console.log("\nticket:\n");

            console.log(JSON.stringify(ticket));

            var params = {
                body: cryptoUtil.RSA.encrypt(ticket),
                statusQuo: HTTP_STATUS.SUCESS.OK
            };

            res.send(params);
        },

        login: function (req, res) {

            console.log("\nlogin\n");

            userObject = req.body.arg0;

            var ticket = JSON.parse(cryptoUtil.RSA.decrypt(req.headers.ticket));

            console.log("\nlogin - ticket: " + JSON.stringify(ticket));

            console.log("\nlogin - req: \n", JSON.stringify(req.body));

            console.log("\nUser email: \n", cryptoUtil.AES.decrypt(userObject, ticket));

            userObject = cryptoUtil.AES.decrypt(userObject, ticket);

            console.log("\nUser Dec: \n" + JSON.stringify(userObject));

            userModel.findOne({
                    uid: userObject.uid
                },
                function (error, response) {
                    if (error) {

                        console.log("Error - user - step 1 " + error);

                        sendError(res, error, HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                    } else if (response == null) {

                        userObject.complains = 0;
                        userObject.blocked = false;
                        userModel.create(userObject, function (error, response) {
                            if (error) {

                                console.log("Error - user - step 2 " + error);

                                sendError(res, error, HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                            } else {
                                console.log("User created: " + userObject.link);

                                req.session.user = response;
                                sendToken(req, res, "user created", HTTP_STATUS.BUSINESS.DUPLICATED_REGISTER, cryptoUtil.RSA.decrypt(req.headers.ticket, 'utf-8'));
                            }
                        });
                    } else {
                        req.session.user = response;
                        sendToken(req, res, "User already exists", HTTP_STATUS.SUCESS.CREATED, cryptoUtil.RSA.decrypt(req.headers.ticket, 'utf-8'));
                    }
                });

            function sendError(res, message, httpStatus) {
                var params = {
                    message: message,
                    statusQuo: httpStatus,
                    body: null
                };
                console.log(params);
                res.send(params);
            }

            function sendToken(req, res, message, httpStatus, ticket) {
                var token = {
                    user: req.session.user,
                    ticket: JSON.parse(ticket)
                };

                console.log("Send token: " + JSON.stringify(ticket));

                var params = {
                    message: message,
                    statusQuo: httpStatus,
                    body: jsonWebToken.encode(token, secret)
                };
                res.send(params);
            }
        }

    };

    return LoginController;
} 