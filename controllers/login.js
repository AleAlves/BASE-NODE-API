module.exports = function (app) {

    var userModel = app.models.user;
    var user = app.models.user;
    const cryptoUtil = app.security.crypto;

    return LoginController = {

        init: function (req, res) {

            console.log("\ninit\nPublickey: " + cryptoUtil.RSA.publicKey());

            let params = {
                publicKey: cryptoUtil.RSA.publicKey(),
                status: HTTP_STATUS.SUCESS.OK
            };

            res.send(params);
        },

        ticket: function (req, res) {

            console.log("\nticket\n");

            console.log(JSON.stringify(req.body));

            let ticket = cryptoUtil.RSA.decrypt(req.body.content, 'json');

            console.log("\nticket:\n");

            console.log(JSON.stringify(ticket));

            let params = {
                ticket: cryptoUtil.RSA.encrypt(ticket),
                status: HTTP_STATUS.SUCESS.OK
            };

            res.send(params);
        },

        login: function (req, res) {

            console.log("\n\nlogin");

            let content = req.body.content;

            console.log("\n\nlogin - content: " + content);

            let ticket = JSON.parse(cryptoUtil.RSA.decrypt(req.headers.ticket));

            console.log("\n\nlogin - ticket: " + JSON.stringify(ticket));

            console.log("\n\nlogin - user data:" + JSON.stringify(cryptoUtil.AES.decrypt(content, ticket)));

            user = cryptoUtil.AES.decrypt(content, ticket);

            console.log("\n\n --- - - -- - -- - - -\n");

            console.log("\n\nlogin - user object: \n" + JSON.stringify(user));

            userModel.findOne({
                    uid: user.uid
                },
                function (error, response) {
                    if (error) {

                        console.log("Error - user - step 1 " + error);

                        sendError(res, error, HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                    } else if (response == null) {
                        userModel.create(user, function (error, response) {
                            if (error) {

                                console.log("Error - user - step 2 " + error);

                                sendError(res, error, HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                            } else {
                                console.log("User created: " + user.name);
                                sendToken(res, response, "User created", HTTP_STATUS.SUCESS.CREATED, cryptoUtil.RSA.decrypt(req.headers.ticket, 'utf-8'));
                            }
                        });
                    } else {
                        sendToken(res, response, "User already exists", HTTP_STATUS.SUCESS.ACCEPTED, cryptoUtil.RSA.decrypt(req.headers.ticket, 'utf-8'));
                    }
                });

            function sendToken(res, user, message, httpStatus, ticket) {
                let token = {
                    user: user,
                    ticket: JSON.parse(ticket)
                };

                console.log("Sent token: " + JSON.stringify(ticket));

                let params = {
                    message: message,
                    status: httpStatus,
                    token: cryptoUtil.JWT.encode(token)
                };
                res.send(params);
            }
        },

        delete: function (req, res) {

            let userToken = cryptoUtil.JWT.decode(req.headers.token);

            if (userToken == null) {

                sendError(res, error, HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED);
            } else {

                userModel.deleteOne({
                    _id: userToken.uid
                }, function (error) {
                    if (!error) {
                        sendError(res, error, HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                    } else {
                        var response = {
                            status: HTTP_STATUS.SUCESS.OK
                        };
                        res.send(response);
                    }
                });
            }
        }

    };
}

function sendError(res, message, httpStatus) {
    let params = {
        message: message,
        status: httpStatus,
        body: null
    };

    console.log(params);
    res.send(params);
}