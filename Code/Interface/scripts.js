var session = pl.create(1000);
session.consult("sudoku.pl");
/** SUDOKU */
// Callback function
function show(grille) {
	// Get output container
	var result = document.getElementById("result");
	// Return callback function
	return function(answer) {
			// Get the value of the food
			var res_sudoku = session.query("oneSolution("+grille+").");
			// Show answer
			//console.log(res_sudoku);
			result.innerHTML = result.innerHTML + "<p>" + res_sudoku + "</p>";
	};
}

function solve_sudoku(gril){

	// Clear le output
	document.getElementById("result").innerHTML = "";
	// Ce que l'on cherche
	//var resu = session.query("oneSolution([[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_]],D).");
	var resu = session.query("likes(arthur,X).");
	console.log(resu);
	// Affichage des solutions
	var callback = console.log;
	session.answer(callback);
	//session.answers(show(gril), 1000);
}

function clickButtonRes() {
	var grille = document.getElementById("matrice_incomplete").value;
	grille = grille != "" ? grille : "Y";
	// Get les results
	solve_sudoku(grille);
}

function clickButtonInc() {

}
