# Brass: Birmingham

## Explication : construction d'un double Rail

La construction d'un double Rail est résolue comme deux constructions successives. Pour chaque tronçon, le joueur doit pouvoir acheminer vers ce tronçon la quantité de charbon requise par les règles standard, depuis une source accessible à son réseau au moment où ce tronçon est construit. La mine peut appartenir au joueur actif ou à un autre joueur : seule l'accessibilité du charbon selon les règles normales compte.

La propriété de la mine et l'appartenance au réseau du joueur qui construit sont deux choses différentes. Si la mine en B appartient au joueur B, B peut faire partie du réseau du joueur B selon les règles normales, mais cela ne la fait pas automatiquement entrer dans le réseau du joueur actif. Pour utiliser son charbon, le joueur actif doit avoir une connexion valide vers B au moment où il construit le tronçon concerné.

Le charbon ne peut pas traverser un tronçon qui n'est pas encore construit. Le joueur ne peut donc pas utiliser le charbon d'une mine située à l'extrémité ou au milieu du double Rail pour construire le premier tronçon si cette mine n'est pas encore reliée à son réseau. Après la construction du premier tronçon, le réseau est mis à jour avant de vérifier et de construire le second.

Par exemple, si le réseau du joueur constructeur est relié au Marchand mais pas à A ni à B, que ce joueur ne possède aucune construction à B (ni la mine ni une autre industrie) et qu'une mine située à B contient du charbon, il est interdit de construire d'abord B → A puis A → Marchand en utilisant le charbon de B. Le joueur doit construire Marchand → A en achetant le charbon au marché, puis construire A → B. Une fois A relié à son réseau, le charbon de la mine de B peut être utilisé pour le tronçon A → B si toutes les autres conditions de construction sont respectées.
