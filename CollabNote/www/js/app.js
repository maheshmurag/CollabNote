// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngTagsInput'])

.run(function ($ionicPlatform, $rootScope, $state, spellcheck) {

    Parse.initialize("FAs7XLJDkIIkJXvHx3Z0UqLvxxKwNJ8VUpJfBDej", "cUbsuBR1F3E6pCyMecLQIRtEJDQcLHtjxuTp2Qri");

    var currentUser = Parse.User.current();
    currentUser = null;
    $rootScope.user = null;
    $rootScope.isLoggedIn = false;

    if (currentUser) {
        $rootScope.user = currentUser;
        $rootScope.isLoggedIn = true;
        $state.go('tab.dash');
    }
    //  spellcheck.prepare();
    $ionicPlatform.ready(function () {



        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('analyze', {
        url: '/analyze',
        templateUrl: 'templates/analyze.html',
        controller: 'AnalyzeController'
    })

    .state('Account', {
        url: '/Account',
        templateUrl: 'templates/Account.html',
        controller: 'AccountController'
    })

    .state('webHome', {
            url: '/webHome',
            templateUrl: 'templates/webHome.html',
            controller: 'webHomeController'
        })
        .state('webHome2', {
            url: '/webHome2',
            templateUrl: 'templates/webHome2.html',
            controller: 'webHome2Controller'
        })

    .state('capture', {
            url: '/capture',
            templateUrl: 'templates/capture.html',
            controller: 'captureController'
        })
        .state('webchat', {
            url: '/webchat/:chatId',
            templateUrl: 'templates/webChat.html',
            controller: 'webchatController'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/webHome');

    $ionicConfigProvider.views.transition('none'); //Disables transitions

})

.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.controller('MainCtrl', function ($scope, Camera, $http) {
    $scope.getPhoto = function () {
        Camera.getPicture().then(function (imageURI) {
            console.log(imageURI);
            $scope.lastPhoto = imageURI;
        }, function (err) {
            console.err(err);
        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    };

    $scope.tags = [
        {
            text: 'Tag1'
        },
        {
            text: 'Tag2'
        },
        {
            text: 'Tag3'
        }
  ];
});
