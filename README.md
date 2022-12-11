# ASP - Trouve ta voie

## Configuration du projet

```cd {directory}```

```sh
npm install
```

### Commande pour faire rouler le projet en local

```sh
npm run dev
```

### Notes :

#### Gestion des erreurs :

Si vous ne trouvez pas la gestion d'une erreur tout juste à la suite de l'appel d'une requête,
telle qu'une erreur 404, c'est la méthode `mapInvalidResponse` qui se chargera de le faire.

Ainsi, pour chaque route de l'API du projet, la requête retourne toujours un code précis lié à la route.

De ce fait, lorsque le status de la réponse d'une requête est `error`, `mapInvalidResponse` utilise le code
lié à la route de la requête et affiche le message associé à ce code.

Finalement, si l'erreur n'est pas gérée dans la méthode appelant la requête, c'est parce qu'il n'y a rien en particulier
à faire avec cette erreur et que nous souhaitons tout simplement faire afficher l'alerte à l'utilisateur
contenant le message d'erreur retourné par la requête.
