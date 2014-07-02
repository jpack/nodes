var nodes = angular.module('nodes', []);
var size = 10;

nodes.controller('boardCtrl', ['$scope', function ($scope) {
    /* Init */


    // Set up the board.
    $scope.board = [];
    for ( var i = 0; i < size; i++) {
        $scope.board[i] = [];

        for ( var j = 0; j < size; j++) {
            $scope.board[i][j] = false;
        }
    }

    /* Create our Web Socket var and register our events */
    var socket = io.connect('http://localhost:8080');

    socket.on('board-update', function (data) {
        console.log("Board update recieved with data: " + data.row + " " + data.col + " " + data.tileValue);

        $scope.board[data.row][data.col] = data.tileValue;
        $scope.$apply();
    });

    /* Create scope functions */
    $scope.updateTile = function(row, col){
        console.log('Sending tile update: ' + row + ' ' + col);

        $scope.board[row][col] = !$scope.board[row][col];

        socket.emit('board-update', {'row': row, 'col': col, 'tileValue': $scope.board[row][col]});
    };
}]);

nodes.controller('targetCtrl', ['$scope', function($scope){
    // Set up the target
    $scope.target = [];
    for ( var i = 0; i < size; i++) {
        $scope.target[i] = [];

        for (var j = 0; j < size; j++) {
            // Set the value to a random true or false.
            $scope.target[i][j] = Math.random()<.5;
        }
    }

    $scope.generateTarget = function(){
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                // Set the value to a random true or false.
                $scope.target[i][j] = Math.random()<.5;
            }
        }
    }
}]);