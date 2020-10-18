/* constants */
const WIDTH = 8;
const HEIGHT = 8;
const RED = "r";
const BLACK = "b";
const PIECE = "&#9673;";
const BLANK = "&nbsp;";

/* game state variables */
var tiles = [[]];       // the tiles on the board
var pieces = [[]];      // the pieces on the tiles
var highlights = [[]];  // the highlights on the tiles
var lastRow = -1;
var lastCol = -1;

/* statistics variables */
var totalReds = 0;
var totalBlacks = 0;
var turn = "black";
var moves = 0;

function startGame() {
	
	tiles = [[]];
	pieces = [[]];
	initTiles(WIDTH, HEIGHT);
	drawTiles();
}

function initTiles(width, height) {
	
	for (var row = 0; row < height; row++) {
		tiles.push([]);
		pieces.push([]);
		highlights.push([]);

		for (var col = 0; col < width; col++) {
			if ((row+col) % 2)		
				tiles[row].push('b');
			else 
				tiles[row].push('r')
			
			if (row<=2 && ((row+col) % 2))
				pieces[row].push('r');
			else if (row>=HEIGHT - 3 && ((row+col) % 2))
				pieces[row].push('b');
			else 
				pieces[row].push(' ');
			
			highlights[row].push(0);
		}	
	}
	
	for (var row = 0; row < pieces.length; ++row) {
		for (var col = 0; col < pieces[row].length; ++col) {
			if (pieces[row][col] == 'b')
				totalBlacks++;
			else if (pieces [row][col] == 'r')
				totalReds++;
		}
	}

	stats();
}

function drawTiles() {

	var html = "";

	for (var row = 0; row < tiles.length; ++row) {
		for (var col = 0; col < tiles[row].length; ++col) {

			var highlight = "";

			if (highlights[row][col])
				highlight = 'id="highlight"';

			if (tiles[row] [col] =='r')
				html += '<button class="redButton" ' + highlight + ' onclick="select(' + row + ',' + col + ');"><span class="';
			else
				html += '<button class="blackButton" ' + highlight + ' onclick="select(' + row + ',' + col + ');"><span class="';

			if (pieces[row][col] == 'r')
				html += 'redPiece">' + PIECE;
			else if (pieces[row][col] == 'b')
				html += 'blackPiece">' + PIECE;
			else
				html += 'blank">' + BLANK;
	
			html += "</span></button>";
		}

		html += "<BR>";
	}
	
	var board = document.getElementById("board");
	board.innerHTML = html;
}

function setRed(row,col) {
	
	if (row <= 0 && row >= HEIGHT) 
		console.log("Row out of bounds");
	if (col <= 0 && col >= WIDTH)
		console.log("Column out of bounds");
	
	pieces[row][col] = RED;
}

function setBlack(row,col) {
	
	if (row <= 0 && row >= HEIGHT) 
		console.log("Row out of bounds");
	if (col <= 0 && col >= WIDTH)
		console.log("Column out of bounds");
	
	pieces[row][col] = BLACK;
}

function clearHighlights() {
	
	for (var row = 0; row < tiles.length; ++row)
		for (var col = 0; col < tiles[row].length; ++col)
			highlights[row][col] = 0;	
}

function highlightRed(selectedRow, selectedCol) {
	
	var targetRow = selectedRow + 1;
	var targetCol = selectedCol - 1;
	if (pieces[targetRow][targetCol] == ' ')
		highlights[targetRow][targetCol] = 1;
	else if (pieces[targetRow][targetCol] == 'b' && pieces[targetRow + 1][targetCol - 1] == ' ')
		highlights[targetRow + 1][targetCol - 1] = 1;

	targetCol = selectedCol + 1;
	if (pieces[targetRow][targetCol] == ' ')
		highlights[targetRow][targetCol] = 1;
	else if (pieces[targetRow][targetCol] == 'b' && pieces[targetRow + 1][targetCol + 1] == ' ')
		highlights[targetRow + 1][targetCol + 1] = 1;
	
	lastRow = selectedRow;
	lastCol = selectedCol;
}

function highlightBlack(selectedRow, selectedCol) {
	
	var targetRow = selectedRow - 1;
	var targetCol = selectedCol - 1;
	if (pieces[targetRow][targetCol] == ' ')
		highlights[targetRow][targetCol] = 1;
	else if (pieces[targetRow][targetCol] == 'r' && pieces[targetRow - 1][targetCol - 1] == ' ')
		highlights[targetRow - 1][targetCol - 1] = 1;

	targetCol = selectedCol + 1;
	if (pieces[targetRow][targetCol] == ' ')
		highlights[targetRow][targetCol] = 1;
	else if (pieces[targetRow][targetCol] == 'r' && pieces[targetRow - 1][targetCol + 1] == ' ')
		highlights[targetRow - 1][targetCol + 1] = 1;
	
	lastRow = selectedRow;
	lastCol = selectedCol;
}

function move(fromRow, fromCol, toRow, toCol) {

	var piece = pieces[fromRow][fromCol];
	pieces[toRow][toCol] = piece;
	pieces[fromRow][fromCol] = ' ';
	
	if (Math.abs(fromRow - toRow) == 2 || Math.abs (fromCol - toCol) == 2) {
		
		var centerRow = (fromRow + toRow) / 2;
		var centerCol = (fromCol + toCol) / 2;
		pieces[centerRow][centerCol] = ' ';
	}
	
	clearHighlights();
	drawTiles();
	
	if (turn == "red")
		turn = "black";
	else if (turn == "black")
		turn = "red";
	moves++;
	
	stats();
}

function select(selectedRow, selectedCol) {
	
	if (highlights[selectedRow][selectedCol] == 1)  // user selected a highlight
		move(lastRow, lastCol, selectedRow, selectedCol);
	else if (pieces[selectedRow][selectedCol] == 'b' || pieces[selectedRow][selectedCol] == 'r') {  // user selected a piece
		clearHighlights();
		
		if (pieces[selectedRow][selectedCol] == 'r' && turn == "red")
			highlightRed(selectedRow, selectedCol);
		else if (pieces[selectedRow][selectedCol] == 'b' && turn == "black")
			highlightBlack(selectedRow, selectedCol);

		drawTiles();
	}
}

function stats () {
	var redCount = 0;
	var blackCount = 0;
	for (var row = 0; row < pieces.length; ++row) {
		for (var col = 0; col < pieces[row].length; ++col) {
			if (pieces[row][col] == 'b')
				blackCount++;
			else if (pieces [row][col] == 'r')
				redCount++;
		}
	}
	var capturedReds = totalReds - redCount;	
	var capturedBlacks = totalBlacks - blackCount;	

			
	document.getElementById("blackInfo").innerHTML = capturedBlacks.toString() + "/" + blackCount.toString();
	document.getElementById("redInfo").innerHTML = capturedReds.toString() + "/" + redCount.toString();
	document.getElementById("moves").innerHTML = moves.toString();
	
	if (turn == "red")
		document.getElementById("turn").innerHTML = '<span id = "red">Turn</span>';
	else if (turn == "black")
		document.getElementById("turn").innerHTML = '<span id = "bold">Turn</span>';
	
	if (redCount == 0)
		document.getElementById("winner").innerHTML = "Black is the winner!";
	else if (blackCount == 0)
		document.getElementById("winner").innerHTML = "Red is the winner!";
}