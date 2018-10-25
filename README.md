Projet IA02
===

# Introduction


Ce projet consiste en la réalisation d'un jeu de Sudoku en PROLOG

Cette application aura plusieurs fonctionnalités :
  - Génération automatique de grilles Sudoku,
  - Gestion de toutes les étapes du jeu de Sudoku (génération aléatoire de la grille, remplissage étape par étape par l'utilisateur, vérification des valeurs impossibles)
  - Résolution automatique d’une grille donnée

La résolution du projet nécessite de procéder par étapes.
+ La première est la création d'un sudoku "vide": une grille vide représentée sous forme de liste de liste.
+ Ensuite, nous avons affiché un sudoku quelconque sur la console
+ Troisièmement, il a fallut créer toute la partie "test de la validité" d'une matrice
    - Prédicat de vérification des lignes
    - Prédicat de vérification des colonnes
    - Prédicat de vérification des matrice 3x3
    - Prédicat de vérification des le domaine [1..9]
+ Finalement, nous avons créé le prédicat qui permet de résoudre un sudoku et d'en trouver toutes les solution atteignables à partir d'un état donné.


# Afficher la matrice

Pour afficher la matrice, il suffit d'appliquer un prédicat "write" à toutes les cases et s'en servir pour afficher la valeur de la case si elle est pleine et un espace si elle est vide:
---
# Test de la validité
### Vérification du domaine [1..9]
On se sert du prédicat standard "member" pour créer un prédicat "chiffre" qui vérifie si un chiffre appartient au domaine valide.

On utilisera ce prédicat par la suite lorsqu'on voudra tester l'ajout d'un chiffre à la grille.

### Vérification des lignes
On étudie tout d'abord la validité d'une ligne isolée
Pour se faire, on réutilise le prédicat "appartient" que nous avions créé lors du TP1 que l'on utilise avec un peu de récursivité.
Une fonction qui nous sera utile plus tard et qui vérifie que tous les chiffres d'une liste sont différent est ainsi crée.


Enfin, un **verifierAllLignes** est créé qui permet de vérifier l'unicité des chiffres pour chaque liste de la matrice en appliquant le prédicat de vérification à chacune des lignes.

### Vérification des colonnes
Un peu plus complexe, nous avons opté pour une solution "mathématique". En effet, l'idée de rotate la matrice nous est venu : **transpose**. Les colonnes deviennent alors des lignes, de fait, nous pouvons réutiliser le prédicat pour vérifier les lignes.
Pour cela, avec le prédicat lignes, on prend le premier élément de chaque lignes, que l'on concatène ensemble pour créer des lignes.
Le processus est répété jusqu'à atteindre la fin de la matrice.


### Vérification des matrices 3x3
Pour pouvoir effectuer la vérification sur les sous-matrices de dimension 3*3, il faut tout d'abord arriver à grouper les éléments ensemble.
Le prédicat **petiteMatrice** permet de récupérer la matrice sous forme de liste de lignes et renvoie la liste des colonnes.
Le prédicat distingue deux sortes de cas selon les arguments qu'on lui donne en entrée: le premier nous permet de sélectionner toutes les lignes 3 par 3. Le second concatène tous les 3 éléments pour chaque partie de 3 lignes.
On obtient une liste de liste de liste. On devra ensuite utiliser la fonction flatt pour pouvoir appliquer verifierAllLignes par la suite.

---

# Remplissage de la grille
### Création des prédicats de remplissage et de vérification de la validité pour chaque ajout.
Le prédicat **matriceValide** sert à vérifier si la matrice est valide selon les règles du Sudoku. Celui-ci va utiliser tous les prédicats mentionnés plus haut et va vérifier que la grille rentrée en argument est bien valide. On applique donc la fonction verifierAllLignes, on utilise **transpose** pour récupérer la matrice sous forme de colonnes, on peut ainsi réutiliser le prédicat **vérifierAllLignes** pour vérifier que les valeurs des colonnes sont valides. Enfin, on utilise **petiteMatrice** que l'on applatit à l'aide de la fonction **flatt** pour pouvoir utiliser encore une fois un verifierAllLignes.

Ensuite, on a le prédicat **testValidite**. Prédicat de récursivité qui prends le premier élément d'une liste et qui vérifier qu'il est bien dans le domaine [1..9]. On le concatène en tête avec le reste de la liste à l'aide d'un flatt puis on l'**unflatt**.

Finalement on créer le prédicat **sudoku** qui nous sert simplement à flatt la matrice avant de la rentrer dans le testValidite.

### Création des prédicats qui permette la résolution et de trouver tous les sudoku
**allSolution**
Ce prédicat nous permet de trouver toutes les grilles atteignables après l'ajout d'un chiffre dans la grille.
Ainsi, on utilise dans ce prédicat un setof pour grouper toutes les solutions.
On utilise ensuite le prédicat **afficherAllPossibilies** afin d'afficher toutes ces grilles.

**allOneSolution**
Ce prédicat nous permet de trouver toutes les grilles atteignables après l'ajout d'un chiffre dans la grille une par une.

**oneSolution**
Ce dernier prédicat va trouver une unique solution pour une grille incomplète donnée.
On a juste à lancer les prédicats **sudoku** et **afficherSudoku** suivi d'un arrêt "!"

# Generation aléatoire de grilles incompletes

# Interface

Pour l'interface, nous avons utilisé uniquement prolog. Nous utilisons en quelque sorte un "menu". 3 options s'offrent à nous, le premier choix permet de résoudre une grille que nous rentrons manuellement. Le second permet de vérifier qu'une matrice quelconque 9x9 est valide ( incomplète ou pas). Le dernier est l'interface même de jeu. On choisit la grille, puis on choisit la ligne et la colonne et son selectionne le chiffre correspondant.


# Problèmes rencontrés

Lors de ce projet, plusieurs difficultés se sont profilées.
Tout d'abord, n'ayant aucune base de prolog, le commencement fut assez complexe. Une mise à jour s'est vite effectuée grâce aux TDs. Ensuite, nous avons eu quelques problèmes/choix concernant la vérification des sudoku. En effet, pour les vérifications colonnes, nous avons commencé par créer un prédicat qui sélectionnait l'ensemble des colonnes du sudoku et vérifiaient qu'ils étaient tous bien différent. Nous avons préféré l'option de rotate la matrice afin de pouvoir ré-utiliser le prédicat **verifierAllLignes**.
De plus, même chose pour la sélection des petites matrices 3x3. La première solution fut de mettre en variable chaque case du sudoku puis de les sélectionner à la mode "bourrin". le temps de calcul plus long et l'élégance de la solution ne nous convenait pas, nous avons conclut qu'il fallait créer un prédicat Tete/Queu afin de palier au problème.
Finalement, le dernier, et sans doute le plus compliqué à résoudre fut celui de l'optimisation de la recherche de solutions. En effet, notre premier prédicat qui cherchait les solutions était bien trop long (40s pour trouver une matrice).
Après plusieurs jours de recherche intensives, nous avons enfin trouver comment le résoudre. Les solutions sont maintenant trouvées quasi-directement.

# Réaction après-coup sur le projet Sudoku

Ce projet nous a particulièrement intéressé. En effet, c'était un projet très prenant et ludique. Il nous a permis
de nous améliorer dans le langage prolog, mais aussi a développer des capacités de réflexions abouties. De plus,
le projet étant très prenant, nous n'avons pas eu de mal à travailler dessus.
Aucun points négatifs ne nous vient cependant à l'esprit si ce n'est le fait qu'on aurait apprécier de pouvoir faire
une interface pour notre programme. Aucun base n'a été donnée, nous n'avons pas vraiment réussi et c'est un regret.
Nous aurions aussi vraiment aimé pouvoir créer un prédicat/fonction sur l'interface permettant de générer une grille incomplète aléatoirement.
