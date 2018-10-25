:- use_module(library(lists)).
/* =======================================================================*/
/*  --------------------- Projet IA02 P18 : Le Sudoku --------------------*/
/* =======================================================================*/
/* =======================================================================*/
/*                        FONCTIONS DE BASE DU SUDOKU                     */
/* =======================================================================*/
grilleVide(X):- X=
[
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_]
].

afficherLigne([]):-!.
afficherLigne([X|Y]):- \+ var(X), write(' '), write(X),  afficherLigne(Y).
afficherLigne([X|Y]):- var(X), write(' '), write(' '),  afficherLigne(Y) .

afficherSudoku([]):-!.
afficherSudoku([X|Y]):- afficherLigne(X), nl,
                        afficherSudoku(Y).
all_diff(L) :- \+ (append(_,[X|R],L), memberchk(X,R)).

afficherAllPossibilies([]).
afficherAllPossibilies([T|Q]):- afficherSudoku(T), nl, nl,
                                afficherAllPossibilies(Q).

/* un matrice valide complete*/
/*
[[_,3,4,6,7,8,9,_,2],
[6,_,2,1,_,5,3,4,_],
[1,_,8,3,4,_,5,6,7],
[8,5,_,7,6,1,4,2,3],
[4,2,_,_,5,3,7,9,1],
[7,1,3,9,2,4,8,_,_],
[9,6,1,_,3,7,2,_,4],
[_,8,7,4,1,9,_,3,5],
[3,4,5,2,8,_,1,7,9]]

*/

/* une matrice valide partielle*/

/*
[[1,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,4,_],
[_,_,_,5,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,6,_,_,_,_,8,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,_,_,_],
[_,_,_,_,_,_,7,_,_],
[_,9,_,_,_,6,_,_,_]]

ou

[[_,_,_,_,7,_,_,1,2],
[6,_,_,1,_,_,3,_,8],
[_,_,_,3,_,2,_,6,_],
[_,_,9,_,_,1,_,2,_],
[_,2,_,_,5,_,7,_,_],
[7,_,_,9,_,_,_,_,6],
[_,_,1,5,_,_,_,_,4],
[_,_,7,_,1,_,6,_,_],
[3,_,_,2,_,6,_,7,_]]

en 11sec pour allSolution
en 0.3sec pour oneSolution

*/



/* =======================================================================*/
/*                  FONCTIONS DE VERIFICATION DE LA MATRICE               */
/* =======================================================================*/

/* verifier que tous les elements d'une liste sont differents */
appartient(X,[Y|_]):- X==Y,nonvar(X).
appartient(X,[_T|Q]):- nonvar(X),appartient(X,Q).

verifierDifferent([]).
verifierDifferent([T|Q]):- \+ appartient(T,Q), verifierDifferent(Q).

/* verifier que toutes les lignes on des elements uniques */
verifierTotalLigne([]).
verifierTotalLigne([X|Y]):- verifierDifferent(X), verifierTotalLigne(Y).

/* verification de l'ensemble des colonnes d'une matrice I debut et K fin*/
verifierTotalColonne(M):-
          rotateMe(M,Retour),
          verifierTotalLigne(Retour).

/*Transformation des petites matrices 3x3*/
petiteMatrice([A,B,C,D,E,F,G,H,I], Blocs) :-
          petiteMatrice(A,B,C,Bloc1),
          petiteMatrice(D,E,F,Bloc2),
          petiteMatrice(G,H,I,Bloc3),
          appends([],[Bloc1, Bloc2, Bloc3], Blocs).

petiteMatrice([], [], [], []).
petiteMatrice([A,B,C|Reste1],[D,E,F|Reste2],[G,H,I|Reste3], [Bloc|Blocs]) :-
    Bloc = [A,B,C,D,E,F,G,H,I],
    petiteMatrice(Reste1, Reste2, Reste3, Blocs).


/* =======================================================================*/
/*              FONCTIONS PERMETANT LA RESOLUTION DU SUDOKU               */
/* =======================================================================*/

/* Test la validite d'une liste */
matriceValide(M):-
      Lignes = M,
      rotateMe(M, Colonnes),
      petiteMatrice(M, B),
      flatt(B, Blocs),
      verifierTotalLigne(Lignes),
      verifierTotalLigne(Colonnes),
      verifierTotalLigne(Blocs).

testValidite([], _):-!.
testValidite([T|Q], R):-
      chiffre(T),
      concatenate(R, [T],F),
      flatt([F,Q], Matrice),
      unflatt(Matrice, MyMatrice),
      matriceValide(MyMatrice),
      testValidite(Q,F).

sudoku(M):-
      flatt(M, Flatted),
      testValidite(Flatted,[]).

/* Trouver TOUTES les solutions du sudoku */
allSolution(L):- setof(L, sudoku(L), Retour),
                 afficherAllPossibilies(Retour).

/* Trouver UNE SEULE solution du sudoku */
oneSolution(M,Res):- sudoku(M), afficherSudoku(M), concatenate(R,[],Res), !.


/* =======================================================================*/
/*                            FONCTIONS UTILES                            */
/* =======================================================================*/

/* fonction de concatenation */
appends([], List, List).
appends([Head|Tail], List, [Head|Rest]) :-
appends(Tail, List, Rest).
concatenate(List1, List2, Result):-
      appends(List1, List2, Result).

/* transforme liste de liste en liste simple */
flatt([],[]).
flatt([T|Q], M):- flatt(Q, R), append(T,R,M).

/* transforme liste simple en liste de liste (9x9) */
unflatt([],[]):-!.
unflatt([T1,T2,T3,T4,T5,T6,T7,T8,T9|Q], [E|L]):-
          unflatt(Q, L),
          concatenate(_R,[T1,T2,T3,T4,T5,T6,T7,T8,T9], E), !.

/* verififaction qu'un element est bien un chiffre*/
chiffre(1).
chiffre(2).
chiffre(3).
chiffre(4).
chiffre(5).
chiffre(6).
chiffre(7).
chiffre(8).
chiffre(9).
/* verifie qu'une liste est composee de chiffre */
allChiffre([]):-!.
allChiffre([T|Q]):-chiffre(T), allChiffre(Q).

/*transpose la matrice */
rotateMe([[]|_], []).
rotateMe(M, [X|T]) :- col(M, X, M1),
                       rotateMe(M1, T).
col([], [], []).
col([[X|Xs]|Ys], [X|R], [Xs|Z]) :- col(Ys, R, Z).

/*verification qu'une liste a des chiffres uniques*/
unique(Lst) :-
    setof(X, (member(X, Lst)), Set),
    length(Lst, N),
    length(Set, N).

/* verifie que call(C_2, X) true pour tous les elements de la liste*/
mymap([]).
mymap([X|Xs]):-
    call(unique(X)),
    mymap(Xs).


/*================================================================*/
/*                  FONCTIONS STYLE MAIS USELESS                  */
/*================================================================*/

/*reccupération d'une colonne */
/*recupColonne([], _I, []).
recupColonne([T|Q], I, [E|L2]):- recupColonne(Q,I,L2), nth1(I,T,E).
*/


/*verifierTotalColonne(_,I,I).
verifierTotalColonne(M, I, K):-
    J is I+1,
    J<K+1,
    recupColonne(M,J,F),
    verifierDifferent(F),
    verifierTotalColonne(M,J,K).
*/




/*verification des petites matrices
reccuperation des chiffres de M[I] a M[K]
recupLigne(_,I,I,[]).
recupLigne(M,I,K,[E|L]):-
    J is I+1,
    J< K+1,
    recupLigne(M,J,K,L),
    nth(J,M,E).
reccuperation des lignes des K premieres lignes avec les chiffre de M à N
recupCarre(_,I,I,_M,_N, []).
recupCarre([T|Q], I, K, M, N, [E|L]):-
        J is I+1,
        J<K+1,
        recupLigne(T,M,N,E),
        recupCarre(Q,J,K,M,N,L).

 verification d'une petite matrice

verifierCarre(Matrice):-
  flatt(Matrice, F),
  verifierDifferent(F).

verifier une Ligne de Nbre petites matrices  Matrices (Debut=0)
verifierLigneCarre(_T, _I, _K, _M, _N, Nbre, Nbre).
verifierLigneCarre(T, I, K,M,N, Debut, Nbre):-
      Z is (Debut+1),
      Z<Nbre+1,
      recupCarre(T,I,K,M,N, Petite),
      verifierCarre(Petite),
      W is (N),
      X is (N+(N-M)),
      verifierLigneCarre(T,I,K,W,X,Z, Nbre).
 verifier toutes les lignes de patites matrices
verifierAllMatrices([T|[T2|[T3|[T4|[T5|[T6|R]]]]]], I, K, M, N, Indent, End):-
        verifierLigneCarre([T|[T2|[T3|[T4|[T5|[T6|R]]]]]], I,K,M,N,Indent, End),
        verifierLigneCarre([T4|[T5|[T6|R]]], I,K,M,N,Indent, End),
        verifierLigneCarre(R, I,K,M,N,Indent,End).



        verifierTotalLigne(Lignes),
        verifierTotalLigne(Colonnes),
        verifierTotalLigne(Blocs),*/

        likes(sam, salad).
        likes(dean, pie).
        likes(sam, apples).
        likes(dean, whiskey).
