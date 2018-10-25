/* =======================================================================*/
/*  --------------------- Projet IA02 P18 : Le Sudoku --------------------*/
/* =======================================================================*/
/*                      LAMDASNI AYMAN x PAIGNEAU HUGO                    */
/* =======================================================================*/
/*                            FONCTIONS UTILES                            */
/* =======================================================================*/

/* fonction de concatenation */
concatenate([], List, List).
concatenate([Head|Tail], List, [Head|Rest]) :-
concatenate(Tail, List, Rest).


/* transforme liste de liste en liste simple */
flatt([],[]).
flatt([T|Q], M):- flatt(Q, R), concatenate(T,R,M).

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


/*transpose la matrice */
transpose([[]|_], []).
transpose(M, [T|Q]) :- lignes(M, T, M1),
                       transpose(M1, Q).
lignes([], [], []).
lignes([[L|Ls]|Ys], [L|R], [Ls|Z]) :- lignes(Ys, R, Z).


/* =======================================================================*/
/*                        FONCTIONS DE BASE DU SUDOKU                     */
/* =======================================================================*/
/* Affiche une ligne du sudoku */
afficherLigne([]):-!.
afficherLigne([T|Q]):- \+ var(T), write(' '), write(T),  afficherLigne(Q).
afficherLigne([T|Q]):- var(T), write(' '), write(' '),  afficherLigne(Q) .

/* Affiche toutes les lignes du sudoku grâce à un appel recursif */
afficherSudoku([]):-!.
afficherSudoku([T|Q]):- afficherLigne(T), nl,
                        afficherSudoku(Q).

/* Affiche tous les sudoku et pas un seul */
afficherAllPossibilies([]).
afficherAllPossibilies([T|Q]):- afficherSudoku(T), nl, nl,
                                afficherAllPossibilies(Q).

/* un matrice valide complete*/
/*

[[_,_,_,_,7,_,_,1,2],[6,_,_,1,_,_,3,_,8],[_,_,_,3,_,2,_,6,_],[_,_,9,_,_,1,_,2,_],[_,2,_,_,5,_,7,_,_],[7,_,_,9,_,_,_,_,6],[_,_,1,5,_,_,_,_,4],[_,_,7,_,1,_,6,_,_],[3,_,_,2,_,6,_,7,_]]

*/

/* =======================================================================*/
/*                  FONCTIONS DE VERIFICATION DE LA MATRICE               */
/* =======================================================================*/

/* verifier que tous les elements d'une liste sont differents */
appartient(X,[T|_]):- X==T,nonvar(X).
appartient(X,[_T|Q]):- nonvar(X),appartient(X,Q).

verifierDifferent([]).
verifierDifferent([T|Q]):- \+ appartient(T,Q), verifierDifferent(Q).

/* verifier que toutes les lignes on des elements uniques */
verifierTotalLigne([]).
verifierTotalLigne([T|Q]):- verifierDifferent(T), verifierTotalLigne(Q).

/* verification de l'ensemble des colonnes d'une matrice en transposant celle-ci*/
verifierTotalColonne(M):-
          transpose(M,Retour),
          verifierTotalLigne(Retour).

/*Transformation des petites matrices 3x3*/
petiteMatrice([A,B,C,D,E,F,G,H,I], Blocs) :-
          petiteMatrice(A,B,C,Bloc1),
          petiteMatrice(D,E,F,Bloc2),
          petiteMatrice(G,H,I,Bloc3),
          concatenate([],[Bloc1, Bloc2, Bloc3], Blocs).

petiteMatrice([], [], [], []).
petiteMatrice([A,B,C|Reste1],[D,E,F|Reste2],[G,H,I|Reste3], [Bloc|Blocs]) :-
    Bloc = [A,B,C,D,E,F,G,H,I],
    petiteMatrice(Reste1, Reste2, Reste3, Blocs).

/* =======================================================================*/
/*              GENERATION ALEATOIRE DE GRILLES INCOMPLETES               */
/* =======================================================================*/

/* Place N valeurs aléatoires dans la matrice*/
remplissageRandom(
[[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_]]
,0).

remplissageRandom(S,N):-  M is N-1, remplissageRandom(Ss,M), randomSet(Ss,S).

randomSet(S,Rs) :-
    random(1,9,C),
    random(1,9,L),
    random(1,9,X),
    setMatrice(C,L,X,S,[],Ss),
    tester(S,Ss,Rs).

tester(_,Ss, Ss):- matriceValide(Ss).
tester(S,Ss, Rs):- \+ matriceValide(Ss), randomSet(S,Rs).

/* =======================================================================*/
/*              FONCTIONS PERMETANT LA RESOLUTION DU SUDOKU               */
/* =======================================================================*/

/* Test la validite d'une matrice en utilisant les vérification du dessus */
matriceValide(M):-
      Lignes = M,
      transpose(M, Colonnes),
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

/* applati la matrice et la passe dans le test de validité */
sudoku(M):-
      flatt(M, Flatted),
      testValidite(Flatted,[]).

/* Trouver TOUTES les solutions du sudoku */
allSolution(L):- setof(L, sudoku(L), Retour),
                 afficherAllPossibilies(Retour).
/* trouver toutes les solutions 1 par 1 */
allOneSolution(M):- sudoku(M), afficherSudoku(M).

/* Trouver UNE SEULE solution du sudoku */
oneSolution(M):- sudoku(M), afficherSudoku(M), !.


/* =======================================================================*/
/*              INTERFACE DE JEU POUR L'UTILISATEUR                       */
/* =======================================================================*/
/* espace de Jeu */
setCase(1,X,[_|Q],Temp,R):- concatenate(Temp,[X],New),concatenate(New,Q,R).
setCase(N,X,[T|Q],Temp,R):- concatenate(Temp,[T],L), M is N-1, setCase(M,X,Q,L,R).
setCase(L, R):-write('Choix de la case'),nl, read(N),nl, write('Chiffre à placer'),nl, read(X),nl, setCase(N,X,L,_,R), nl.


setMatrice(NC,1,X,[T|Q],Temp,R):- setCase(NC,X,T,_,Res), concatenate(Temp,[Res],NewTemp), concatenate(NewTemp,Q,R).
setMatrice(NC,NL,X,[T|Q],Temp,R):- concatenate(Temp,[T], NewTemp), ML is NL-1, setMatrice(NC,ML,X,Q,NewTemp,R).

setMatrice(M,Res):- write('Choix de la ligne'),nl, read(NL),nl, write('Choix de la colonne'),nl, read(NC), write('Chiffre à placer'),nl, read(X),
setMatrice(NC,NL,X,M,_,Res).

jouer(X):- afficherSudoku(X),setMatrice(X,R), jouer(X,R).
jouer(_,R):-matriceValide(R), jouer(R).
jouer(X,R):- \+ matriceValide(R),nl,nl, write('Vous avez faux !'),nl, jouer(X).

/* Launcher */
launcher:- repeat, menu, !.
/*  1 : Solve le sudoku directement, 2 : Espace de jeu  */
menu:-nl,write('1:Solve sudoku direct'),nl,
         write('2:Jouer'),nl,
         write('Entrer un Choix'), nl,
         read(Choix),nl,user(Choix),
         Choix = 2,nl.
user(1):-write('Résolution du sudoku'),nl,
         write('Entrez le sudoku incomplet'),nl,
         read(Sudok),nl, allOneSolution(Sudok),!.
user(2):-write('Choisir le nombre de valeurs déjà présentes dans le sudoku'),nl,nl,
          read(Nb),
          remplissageRandom(X,Nb),jouer(X).
user(_):-write('Entrez un vrai choix'),nl,!.

jouer(X):- afficherSudoku(X),setMatrice(X,R), jouer(X,R).
jouer(_,R):-matriceValide(R), jouer(R).
jouer(X,R):- \+ matriceValide(R),nl,nl, write('Faux ! Recommencez '),nl, jouer(X).
