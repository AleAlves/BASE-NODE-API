module.exports = (app) => {

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
                status: HTTP_STATUS.SUCESS.OK
            };
            
            res.send(response);
        }
    }
}