## TP Grille

Par Jérémy, Alexis, Marc

- Serveur : C++ 11 avec [wsServer](https://github.com/Theldus/wsServer) comme seule lib
- Client : JS ECMAScript 2015 outil pour l'extrémité avant. L'extrémité avant est faite maison.
- Interface utilisateur : HTML / CSS
- Protocole de communication : WebSocket

**Démo:**
- https://shaiya.fr/UTC503-TP/client

**Depédances Ubuntu:**

- $ sudo apt install build-essential
- $ sudo apt install update
- $ sudo apt install clang
- $ sudo apt install php (seule le serveur HTTP intégré est utilisé pour le développement, la démo utilise NGINX directement)

**Utilisation (UNIX) :**

- $ git clone https://github.com/d4wae89d498/UTC503-TP --recursive && cd UTC503-TP

Compilation :

- $ make
- $ ./tiktaktoe_server & 
- $ ./puissance4_server &
- $ cd client && php -S 127.0.0.1:8667

ou bien :

- $ make dev
Ouvrez un navigateur est nvagiguez vers http://127.0.0.1:8667


Bon jeu !
