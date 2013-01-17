var numRow = 6;
var numCol = 7;

$(document).ready( function() {
	var $board = $('#board');

	$board.css("height", 6*numRow+'em')
	$board.css("width", 6*numCol+'em')

	$board.slideDown('slow','swing');

	for (var i = 0; i < numCol; i++) {
		$board.append('<div class="column"></div>')
			for (var j = 0; j < numRow; j++) {
				$('.column:nth-child('+(i+1)+')').append('<div class="space"></div>', function() {
					//$(this).fadeOut('slow');
				});
			}
	}
	/*for (var i = 0; i < 6; i++) {
		$('.column:nth-child('+(i+1)+')').fadeOut('slow').delay(300).fadeIn('slow');
	}*/

	//$('.column:nth-child(1) .space:nth-child(1)').fadeOut('slow');

	//code for game itself: numRow rows, numCol columns



	console.log('hello!');

	/*var ar = [];
	console.log('ar =' + ar);
	ar.push(1);
	console.log('ar =' + ar)
	ar.push(2);
	console.log('ar =' + ar)*/

	/*var board = [];
	for (var i = 0; i < numCol; i++) {
		board[i] = [];
		for (var j = 0; j < numRow; j++) {
			board[i][j] = 1;
		}
	}
	//board[0].push('yellow');
	console.log('board = ' + board[0][0]);*/

	/* board() {

		this.value = [];
		this.name = [];

		for (var i = 0; i < numCol; i++) {
			this.value[i] = [];
			this.name[i] = [];

			for (var j = 0; j < numRow; j++) {
				this.value[i][j] = 'empty';
				this.name[i][j] = "$('.column:nth-child("+(i+1)+") .space:nth-child("+(j+1)+")')";
			}
		}
	}*/

	board = {
		value: [],
		$name: []
	}

	for (var i = 0; i < numCol; i++) {
			board.value[i] = [];
			board.$name[i] = [];

			for (var j = 0; j < numRow; j++) {
				board.value[i][j] = 'empty';
				board.$name[i][j] = $('.column:nth-child('+(i+1)+') .space:nth-child('+(j+1)+')');
			}
	}

	//console.log(typeof board.name[3][3]);
	//board.$name[3][3].fadeOut('slow');
	//$('.column:nth-child(4) .space:nth-child(4)').fadeOut('slow');

	//var br = new board()
	//console.log(br.name[0][0]);

	//br.name[1][1].fadeOut('slow');
	//$('.column:nth-child(2) .space:nth-child(2)').fadeOut('slow');

});