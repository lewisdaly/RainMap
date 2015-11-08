angular.module('starter.controllers', ['ionic'])

.controller('SettingsCtrl', ['$scope', 'AuthenticationService', '$location', '$rootScope', 'Azureservice', function($scope, AuthenticationService, $location, $rootScope, Azureservice) {

	$scope.$on('$ionicView.enter', function(e) {
		//if the user is an admin, load the list of requesting users!
		var currentUser = $rootScope.globals.currentUser;
		console.log("currentUser: " + JSON.stringify(currentUser));

		if (currentUser) {
			if (currentUser.verified == true) {
				console.log("Requesting unverified users!");
				Azureservice.invokeApi("authenticateuser", {method:'get'})
				.then(function(response) {
					$scope.unverifiedUsers = response;
					console.log("Response: " + JSON.stringify(response));
				},
				function(error) {
					console.log("Error: " + JSON.stringify(error));
				})
			}
		}
	});

	$scope.logout = function() {
		AuthenticationService.ClearCredentials();
		$rootScope.$broadcast('login-state-changed');

		//Alert user
	}

	$scope.verify = function(userID) {
		console.log("Verify");
		var data = {"user_id" : userID, "verified" : true};
		Azureservice.invokeApi("authenticateuser",{method:'put', body:data})
		.then(function(response) {
			console.log("Success! " + JSON.stringify(response))
		},
		function(error) {
			console.log("Error: " + JSON.stringify(error));
		})
	}


}])

.controller('AppCtrl', function($scope, $ionicModal, AuthenticationService, Azureservice, $state, $rootScope) {

	$scope.login = function() {
		console.log("Login!");
		$scope.modal.show();
	}

	$scope.cancel = function() {
		$scope.modal.hide();
	}

	$scope.$on('login-state-changed', function(e) {
		var currentUser = $rootScope.globals.currentUser;
		if(currentUser) {
			$scope.isLoggedIn = true;
		}
		else {
			$scope.isLoggedIn = false;
		}
	})


	//TODO: other services, google etc.
	//TODO: Auto login user!
	//TODO: Abstract this to a service or something

	$scope.facebookLogin = function() {
		console.log("Facebook login");

		Azureservice.login("facebook")
		.then(function(results) {
			var  currentUser = Azureservice.getCurrentUser();
			console.log("Current user: " + JSON.stringify(currentUser));

			Azureservice.invokeApi("authenticateuser", {
				body: {"service":"facebook", "user":Azureservice.getCurrentUser()},
				method: "post"})
			.then(function(response) {
				console.log("Azure success: " + JSON.stringify(response));

				// Store the authenticated user!
				AuthenticationService.SetCredentials(response, currentUser.mobileServiceAuthenticationToken);
				$scope.modal.hide();
			},
			function(err) {
				console.error('Azure Error: ' + err);
				$scope.modal.hide();
			});

		}, function(error){
			alert(error);
			$scope.modal.hide();
		});
	}


	$ionicModal.fromTemplateUrl('/templates/login.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});


	// $scope.closeModal = function() {
	// 	$scope.modal.hide();
	// };

  	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
  		$scope.modal.remove();
  	});
  	// Execute action on hide modal
  	$scope.$on('modal.hidden', function() {
    	// Execute action
    	$state.go($state.current, {}, {reload: true});
    	$rootScope.$broadcast('login-state-changed', { any: {} });

    });
  	// Execute action on remove modal
  	$scope.$on('modal.removed', function() {
   	 // Execute action
   	});

  })
;
