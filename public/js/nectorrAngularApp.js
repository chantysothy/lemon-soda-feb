var nectorrApp = angular.module('nectorrApp', []);

nectorrApp.controller('nectorrController', function ($scope, $http) {
    var nectorrApp = this;
    var fbLogin = {};
    var twitterLogin = {};
    nectorrApp.faceBookLogin = function () {
        alert("here");
        $http.jsonp("/oauth/facebook/?callback=JSON_CALLBACK&data=" + fbLogin).then(function (json) { 
            $scope.response = json.data.data;
        });
        alert("after response");
    };
    nectorrApp.twitterLogin = function () { 
    
    };
    nectorrApp.gPlusLogin = function () { 
    
    };


});