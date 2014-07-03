var nodes = angular.module('nodes', []);
nodes.controller('nodesCtrl', ['$scope', function ($scope) {
    /*
        Controller vars.
     */

    var size = 10;
    var i, j;

    /*
        Scope vars.
     */

    // Set up the board.
    $scope.board = [];
    for (i = 0; i < size; i++) {
        $scope.board[i] = [];

        for (j = 0; j < size; j++) {
            $scope.board[i][j] = false;
        }
    }

    // Set up the target
    $scope.target = [];
    for (i = 0; i < size; i++) {
        $scope.target[i] = [];

        for (j = 0; j < size; j++) {
            // Set the value to a random true or false.
            $scope.target[i][j] = Math.random()<.5;
        }
    }

    // Set up timer.
    $scope.timer = 0;

    /*
     Scope functions
     */

    $scope.updateTimer = function(timer){
        $scope.timer = timer;
        $scope.$apply();
    };

    $scope.updateTile = function(row, col){
        console.log('Sending tile update: ' + row + ' ' + col);

        $scope.board[row][col] = !$scope.board[row][col];

        socket.emit('board-update', {'row': row, 'col': col, 'tileValue': $scope.board[row][col]});
    };

    $scope.generateTarget = function(){
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                // Set the value to a random true or false.
                $scope.target[i][j] = Math.random()<.5;
            }
        }
    };

    $scope.resetBoard = function () {
        for(i = 0; i < size; i++){
            for(j = 0; j < size; j++){
                $scope.board[i][j] = false;
            }
        }
    };

    $scope.gameWin = function(){
        alert('You win!');
        $scope.resetBoard();
        $scope.generateTarget();
    };

    $scope.gameLoss = function(){
        alert('You Lose!');
        $scope.resetBoard();
        $scope.generateTarget();
    };

    /*
        Create our Web Socket var and register our events
    */
    var socket = io.connect('http://162.57.48.18:8080');

    socket.on('board-update', function (data) {
        console.log("Board update recieved with data: " + data.row + " " + data.col + " " + data.tileValue);

        $scope.board[data.row][data.col] = data.tileValue;
        $scope.$apply();
    });

    socket.on('timer-update', function(timer){
        $scope.updateTimer(timer);
    });

    socket.on('round-end', function(){
        var score = 0;

        for(i = 0; i < size; i++){
            for(j = 0; j < size; j++){
                if($scope.board[i][j] == $scope.target[i][j]){
                    score++;
                }
            }
        }

        socket.emit('send-score', score);
    });

    socket.on('round-end-win', function(){
        $scope.gameWin();
    });

    socket.on('round-end-lose', function(){
        $scope.gameLoss();
    });
}]);