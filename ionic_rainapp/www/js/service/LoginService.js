angular.module('service.login', [])

.service("loginService", function($http, $q, apiUrl) {
  //TODO: figure out how to save user's login credentials, and auto login

  //Return public api
  return({
    login: login,
    logout: logout
  });

  //Public Methods
  function login(user) {
    var url = apiUrl + '/api/user/current'; //TODO: change later on.
    var method = 'get';
    var objString = "username=" + user.username + "&password=" + user.password;

    var headers = user ? {authorization : "Basic "
        + btoa(user.username + ":" + user.password)
    } : {};

    return $http({
      method: method,
      headers: headers,
      url: url
    })
    .success(function(data, status, headers) {
      console.log("Login success: " + data);
      //Add the xsrf token manually here - don't think this works
      var token = headers('XSRF-TOKEN');
      $http.defaults.headers.post['X-XSRF-TOKEN'] = headers('XSRF-TOKEN');

    })
    .error(function(data) {


    }); 
  }


  function logout() {
    var baseUrl = apiUrl;
    var request = $http({
      method: "post",
      url: baseUrl + "/logout"
    });
    return (request.then(handleSuccess, handleError));
  }

  //Private Methods
  function handleError(response) {
    if(!angular.isObject(response.data) || !response.data.message) {
      return ($q.reject("An Unknown error occoured"));
    }

    //Otherwise, error message:
    return($q.reject(response.data.message));
  }

  function handleSuccess(response) {
    return(response.data);
  }
});



