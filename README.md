# GWRP_Bot
A Discord bot for GW2RP Toolbox. (FR)

Le bot vous permet de :
- Chercher des personnages sans quitter votre discord : `+persos ? <termes de recherche>`.
- Afficher les dernières rumeurs : `+rumeurs`
- Tirer des dés (r marche aussi au lieu de rand) : `+rand 1d100+20+1d6`
- Tirer des dés en fonction des stats de vos personnage : `+rand S: 1d100+Force+Pugilat-20`
- Notez le "S" au-dessus ? C'est un raccourci vers un personnage (par forcément le votre). Vous pouvez ajouter un raccourci avec `+raccourcis utilitaire`. Ils sont partagés sur tous les serveurs où le bot est actif ! Pratique pour garder votre perso sur toutes vos guilde.
- Vous pouvez afficher vos raccourcis actuels avec `+raccourcis liste`, et en supprimer avec `+raccourcis supprimer <raccourci>`.

Si le bot semble cassé, vous pouvez essayer la commande `+ping`. Si elle marche, c'est que la commande que vous essayez est incorrecte/boguée.

## Commandes
+aide => affiche l'aide du bot

+config prefix <nouveau-préfixe>

+persos ? <termes de recherche> => recherche de personnages
+raccourcis liste => liste vos raccourcis.
+raccourcis supprimer <raccourci / \*> => supprimer un ou tout les raccourcis.
+raccourcis utilitaire => démarre l'utilitaire de création de raccourcis.

+rumeurs => dernières rumeurs

+rand 1d100+50-5*(6+5/2) => lance un dé et effectue le calcul
+rand <raccourci>: 1d100+<caractéristique>+<compétence>-20 => lance un dé avec les statistiques du personnage (si elles existent).

`+ini` => Affiche l'initiative de ce canal.
`+ini reset` => Réinitialise l'initiative.
`+ini set <message>` =>
`+ini auto <surnom> <raccourci>: <jet de dé>` =>
`+ini auto <surnom> <jet de dé>` => 
`+ini auto <raccourci>: <jet de dé>` =>
