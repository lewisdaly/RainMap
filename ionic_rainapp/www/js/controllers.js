angular.module('starter.controllers', [])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope, $location) {

  $scope.logout = function() {
  	$location.path("login");
  }
  
});
