var numRow = 6;
var numCol = 7;
var end = false;    //Is the game over?

$(document).ready( function() {
	
    //Make the playing board the right size
	$('#board').css("height", 6*numRow+'em')
	$('#board').css("width", 6*numCol+'em')
    $('.header').css("width", 6*numCol+'em')

    //Constructor for our board
	board = {
		value: [],	//stores the state of each space on the board
		$name: [],	//stores the jQuery name of each space (e.g. $('.column:nth-child(1) .space:nth-child(1)'))
		columnEmpty: []	//stores how many empty spaces remain in each column
	}

    //Create the board
	for (var i = 0; i < numCol; i++) {

		$('#board').append('<div class="column" id="'+i+'"></div>')
		board.value[i] = [];
		board.$name[i] = [];
		board.columnEmpty[i] = numRow;

		for (var j = 0; j < numRow; j++) {
			$('.column:nth-child('+(i+1)+')').append('<div class="space empty"></div>');
			board.value[i][j] = 'empty';
			board.$name[i][j] = $('.column:nth-child('+(i+1)+') .space:nth-child('+(j+1)+')');

            var value = (numCol*j) + i + 1;   //Total number of spaces so far
            var text = value;

            if (value % 3 == 0) {
                if (value % 5 == 0) {
                    text = 'fizzbuzz';
                }
                else text = 'fizz';
            }
            else if (value % 5 == 0) {
                text = 'buzz';
            }
            board.$name[i][j].append('<p>'+text+'</p>');

			board.$name[i][j].delay(100*(i/(j+1))).fadeTo(1000, 1);
		}
	}

    //Animate the board and title
	$('#board').slideDown(1000,'swing');
    $('h1').animate( { left: 0 },1000 );

    //Fade the hovered over column
	$('.column').hover(
		function() { //mouseenter handler
            if(!end) {
                $(this).children('.empty').each( function (i) {
                    if( i == (board.columnEmpty[$(this).parent().attr('id')] - 1) ) 
                        $(this).stop(true).delay(50*i).fadeTo(200, 0.2);
                    else $(this).stop(true).delay(50*i).fadeTo(200, 0.7);
                });
            }
        }, 
        function () {  //mouseleave handler
            $(this).children('.empty').each( function () {
                $(this).stop(true).fadeTo(500, 1);
            });
        }
    );

    //Whose turn is it? 1 = player 1, -1 = player 2.
    var whoseTurn = 1;	
    var turn = 0;	

    $('.column').click( function() {

        if(!end) {
    
        	var columnNumber = Number($(this).attr('id'));	//The column where the click happened
    
        	if (board.columnEmpty[columnNumber] > 0) {		//Test to see that the column is not full
        		var bottom = board.columnEmpty[columnNumber] - 1;		//The lowest available spot on that column
        		//Assign that space to the appropriate player
        		board.$name[columnNumber][bottom].stop().addClass('player'+(-0.5*whoseTurn+1.5)).removeClass('empty').css('opacity', '1');
                //Fade the space above
                board.$name[columnNumber][bottom-1].stop().fadeTo(200, 0.2);
        		board.value[columnNumber][bottom] = whoseTurn;
    
        		board.columnEmpty[columnNumber]--;	//Remembers how full that column is
                end = checkVictory(board, whoseTurn, bottom, columnNumber);         //Has the game been won?
                if(end) {
                    endAnimation(board);
                }
                
        		whoseTurn *= -1;					//Change whose turn it is
        		turn++;								//Update the turn counter
        	}
        }
    });
}); 

//Has anyone won the game?
function checkVictory(board, whoseTurn, row, col) {

    var connections = 1;                //How many connections have been made?
    //2 variables determining the direction in which we are checking
    var up = 0;
    var right = 0;   

    //For fading animation purposes
    var singleMatch = false;    
    var matches = 0;

    //A matrix of the potentially winning combination
    var winningCombo = [ [col, row] ];

    
    for (var i = 0; i < 4; i++) {      //Check in all 4 directions

        switch(i) {
            case 0:
                up = 0;
                right = 1;
                break;
            case 1:
                up = 1;
                right = 1;
                break;
            case 2:
                up = 1;
                right = 0;
                break;
            case 3:
                up = 1;
                right = -1;
                break;
        }

        for (var j = 0; j < 2; j++) {   //Look both ways!
            for (var k = 1; k < 4; k++) {   //Look 3 spaces ahead
                
                var checkX = (col + k*right);
                var checkY = (row + k*up);
                
                //Are we still on the board
                if (checkY < numRow && checkX < numCol && checkY >= 0 && checkX >= 0) {

                    //Is the next tile of the same player?                    
                    if (board.value[checkX][checkY] == whoseTurn) {
                        if(!singleMatch) { 
                            board.$name[col][row].fadeTo(200, 0.5).fadeTo(200, 1);
                            matches++;
                            singleMatch = true;
                        }
                        board.$name[checkX][checkY].delay(400*(matches-1)+100*k).fadeTo(200, 0.5).fadeTo(200, 1);
                        connections++;
                        winningCombo[connections-1] = [checkX, checkY];
                    }
                    else  break; 
                }
            }
            //look the other way
            up *= -1;
            right *= -1;
        }

        singleMatch = false;

        if (connections >= 4) {
            return winningCombo;
        }
        else {
            connections = 1;
            winningCombo = [ [col, row]];
        }
    }

    return false;
};

function endAnimation(board) {

    $('.space').fadeTo(200, 1);
    var oldText = '';

    for(var i = 0; i < end.length; i++) {
        board.$name[end[i][0]][end[i][1]].stop(true).fadeTo(500, 0, function() {
            $(this).delay(500).css('background-color', 'yellow').fadeTo(500, 1);
        });
        //console.log(i+' = '+end[i]);
    }

    $('h1').animate({ left: -1000}, 200, function() {
        if(board.$name[end[0][0]][end[0][1]].hasClass('player1')) {
            $('title').text("Player 1 Wins!");
            $('h1').text("Player 1 Wins!");
        }
        else {$('h1').text("Player 2 Wins!"); $('title').text("Player 2 Wins!");}
    });
    $('h1').animate({ left: 0}, 200);

    var x = Math.floor(Math.random()*end.length);
    window.setTimeout(function() {
        board.$name[end[x][0]][end[x][1]].fadeTo(500, 0, function () {
            $(this).css('background-color', 'white').fadeTo(500, 1);
            oldText = $(this).children().text();
            console.log(oldText);
            $(this).children().text("Play again?");
        });
    }, 3000);

    board.$name[end[x][0]][end[x][1]].hover( 
        function() {
            $(this).fadeTo(500, 0.5);
        },
        function() {
            $(this).fadeTo(500, 1);
        }
    );

    
    board.$name[end[x][0]][end[x][1]].click( function() {
        restart(board);
        $(this).off('click').off('hover');
        $(this).children().text(oldText);
    });
};

function restart(board) {

    for (var i = 0; i < numCol; i++) {

        board.columnEmpty[i] = numRow;

        for (var j = 0; j < numRow; j++) {
            
            board.value[i][j] = 'empty';
            board.$name[i][j].stop(true).fadeTo(200, 0).delay(100*(i/(j+1))).removeClass('player1').removeClass('player2').addClass('empty').fadeTo(1000, 1).removeAttr('style');
        }
    }

    $('title').text('Connect 4!');

    window.setTimeout(function() {end = false;},1000);
    
};