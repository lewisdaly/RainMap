  angular.module('report.controllers', [])

  .controller('ReportCtrl', function($scope, Chats, $ionicPopup, $http, apiUrl, Azureservice) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.form = {};
  $scope.form.date =  new Date();

  // Validate and submit form
  $scope.sendReport = function(form){
	// TODO: Validate fields
  if (($scope.form.postcode == null) || ($scope.form.postcode == null) || ($scope.form.postcode== null) || ($scope.form.postcode == null))
  {
    console.log("Fill out the form!");
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: "Please fill out all the fields"
    });
  }
  else
  {
    data = {};
    data.wellDepth = $scope.form.wt_depth;
    data.wellID = $scope.form.well_id;
    data.timestamp = new Date();
      //Submit to Azure - write directly to table for now
      // Azureservice.insert('test_well_levels', data)
      // .then(function() { 
      //   console.log('Insert successful');
      // }, function(err) {
      //   console.error('Azure Error: ' + err);
      // });

  Azureservice.invokeApi("mobilerequest", {
    method: "post",
    body:data
  }).then(function(response) {
    console.log("Submitted successfully");

  },function(err) {
    console.log("Error: " + err);
  });



  //   //Send POST Request
  //   var url = apiUrl + '/api/report'
  //   $http.post(url, {
  //     postcode:form['postcode'],
  //     date:form['date'],
  //     wellID:form['well_id'],
  //     depth:form['wt_depth']
  //   })
  //   .then(function(response) {
  //    // Perform on request confirmation:
  //    var alertPopup = $ionicPopup.alert({
  //     title: 'Submitted',
  //     template: 'Thanks!'
  //   });
  //  }, function(response) {
  //   //Error
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Error',
  //     template: response.data.message
  //   });
  // });

}
}})