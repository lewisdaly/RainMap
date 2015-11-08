exports.post = function(request, response) {
    // Use "request.service" to access features of your mobile service, e.g.:
    var tables = request.service.tables;
    //   var push = request.service.push;
    
    //Get the user auth token, and service (facebook, google etc.)
    var service = request.body.service;
    var token = request.body.token;
    var req = require('request');
    
    request.user.getIdentities({
        success: function (identities) {
        //Send request to fb graph api & get username, email
        var fbAccessToken = identities.facebook.accessToken;
        var url = 'https://graph.facebook.com/me?access_token=' + fbAccessToken;

        console.log("URL: " + url);
        req(url, function (err, resp, body) {
            if (err || resp.statusCode !== 200) {
                console.error('Error sending data to FB Graph API: ', err);
                request.respond(statusCodes.INTERNAL_SERVER_ERROR, body);
            } else {
                console.log("FB Response: " + body);
                try {
                    var userData = JSON.parse(body);
                    var userName = userData.name;
                    
                    var userTable = tables.getTable("users");
                    userTable.lookup(userData.id, {
                        success: function(user) {
                            response.send(statusCodes.OK, user);
                        }, 
                        error: function(err) {
                            console.log("Did not find user: " + err);
                            var newUser = {"user_id":userData.id, "user_name":userData.name, "verified": false}
                            userTable.insert(newUser, {
                                success: function() {
                                    console.log("Created new user: "  + JSON.stringify(newUser));
                                }, error: function(error) {
                                    console.log("Error creating new user: " + JSON.stringify(error));
                                }
                            })
                        }
                    }
                    )
                    
                    response.send(statusCodes.OK, userData);
                } catch (ex) {
                    console.error('Error parsing response from FB Graph API: ', ex);
                    request.respond(statusCodes.INTERNAL_SERVER_ERROR, ex);
                }
            }
        });
}
});
};

exports.get = function(request, response) {




};