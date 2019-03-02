module.exports = (app) => {

    const HTTP = app.utils.httpUtils.OK;

    return ServiceController = {

        index: function (req, res) {

            res.render('index', {
                title: packageInfo.name,
                version: packageInfo.version
            });
        },
        version: function (req, res) {

            var response = {
                version: packageInfo.version,
                httpStatus: HTTP
            };
            res.send(response);
        }
    }
}