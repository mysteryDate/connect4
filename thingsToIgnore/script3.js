var numRow = 6;
var numCol = 7;

$(document).ready( function() {
	var $board = $('#board');

	$board.css("height", 6*numRow+'em')
	$board.css("width", 6*numCol+'em')

	board = {
		value: [],	//stores the state of each space on the board
		$name: [],	//stores the jQuery name of each space (e.g. $('.column:nth-child(1) .space:nth-child(1)'))
		columnEmpty: []	//stores how many empty spaces remain in each column
	}

	for (var i = 0; i < numCol; i++) {

		$board.append('<div class="column" id="'+i+'"></div>')
		board.value[i] = [];
		board.$name[i] = [];
		board.columnEmpty[i] = numRow;

		for (var j = 0; j < numRow; j++) {
			$('.column:nth-child('+(i+1)+')').append('<div class="space empty">'+((numCol*i)+j)+'</div>');
			board.value[i][j] = 'empty';
			board.$name[i][j] = $('.column:nth-child('+(i+1)+') .space:nth-child('+(j+1)+')');
			board.$name[i][j].delay(100*(i/(j+1))).fadeTo(1000, 1);
		}
	}

	$board.slideDown(1000,'swing');

	$('.space').hover(
		function() { //mouseenter handler
            //$(this).stop().fadeTo(1000, 0.3);
            //$(this).parent().stop().fadeTo(1000, 0.7);
            $(this).parent().children('.empty').each( function (i) {
                if( i == (board.columnEmpty[$(this).parent().attr('id')] - 1) ) 
                    $(this).stop().delay(50*i).fadeTo(200, 0.3);
                else $(this).stop().delay(50*i).fadeTo(200, 0.7);
            });
        }, 
        function () {  //mouseleave handler
            //$(this).stop().fadeTo(500,1);
            //$(this).parent().stop().fadeTo(500,1);
            $(this).parent().children('.empty').each( function () {
                $(this).stop().fadeTo(500, 1);
            });
        }
    );

    //Whose turn is it? 1 = player 1, -1 = player 2.
    var whoseTurn = 1;	
    var turn = 0;	

    $('.space').click( function() {

    	var columnNumber = Number($(this).parent().attr('id'));	//The column where the click happened

    	if (board.columnEmpty[columnNumber] > 0) {		//Test to see that the column is not full
    		var bottom = board.columnEmpty[columnNumber] - 1;		//The lowest available spot on that column
    		//Assign that space to the appropriate player
    		board.$name[columnNumber][bottom].addClass('player'+(-0.5*whoseTurn+1.5)).removeClass('empty').stop().fadeTo(200, 1);
            //Fade the space above
            board.$name[columnNumber][bottom-1].stop().fadeTo(800, 0.3);
    		board.value[columnNumber][bottom] = whoseTurn;

    		board.columnEmpty[columnNumber]--;	//Remembers how full that column is
            checkVictory(board, whoseTurn, bottom, columnNumber);         //Has the game been won?
    		whoseTurn *= -1;					//Change whose turn it is
    		turn++;								//Update the turn counter
    	}
    });
}); 

function checkVictory(board, whoseTurn, row, col) {

    var connections = 1;                //How many connections have been made?
    //2 variables determining the direction in which we are checking
    var up = 0;
    var right = 0;

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

                    //board.$name[checkX][checkY].delay(400*i+100*k).fadeTo(200, 0.5).fadeTo(200, 1);

                    //Is the next tile of the same player?                    
                    if (board.value[checkX][checkY] == whoseTurn) {
                        //board.$name[col][row].fadeTo(200, 0.5).fadeTo(200, 1);
                        board.$name[checkX][checkY].delay(100*i+100*k).fadeTo(200, 0.5).fadeTo(200, 1);
                        connections++;
                    }
                    else  break; 
                }
            }
            //look the other way
            up *= -1;
            right *= -1;
        }

        console.log(connections);

        if (connections >= 4) {
            return true;
        }
        else {
            connections = 1;
        }
    }
};

//2490 ndame west
//2515 
// turn right on ndame