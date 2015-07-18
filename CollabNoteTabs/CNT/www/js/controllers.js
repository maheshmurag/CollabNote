angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {})

.controller('ChatsCtrl', function ($scope, Chats, $http) {

    //$scope.$on('$ionicView.enter', function(e) {
    //});
//    $scope.uploadFile = function(){
//        console.log('fdsa')
//        alert("fda ");
//    };
    $scope.uploadFile = function (files) {
        var fd = new FormData();

//        console.log(JSON.stringify(files[0]))
        fd.append("file", files[0]);
        $http.post("/endpointUrl", fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            })
            .success(function (data) {
                    alert(JSON.stringify(data));
                })
            .error(function (data) {
                alert("bad things: " + JSON.stringify(data))
            });
        };

})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
