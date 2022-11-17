## TP Grille

Par Jérémy, Alexis, Marc

- Server : C++ 11 with [wsServer](https://github.com/Theldus/wsServer) as only external lib
- Client : JS ECMAScript 2015 wihout any external lib (the entire front-end framework is home-made)
- User interface : HTML / CSS
- Communication Protocol : WebSocket

**UNIX Usage :**

- $ git clone https://github.com/d4wae89d498/UTC503-TP --recursive && cd UTC503-TP

then compile and run with :
- $ make
- $ ./tiktaktoe_server & 
- $ ./puissance4_server &
- $ cd client && php -S 127.0.0.1:8667

or :

- $ make dev

open a browser and navigate to http://127.0.0.1:8667

How to setup WSL :

entrez un nom d'utilisateur : useradd "nom d'utilisateur"
puis renseignez le mot de passe.

Pour installer le compilateur tapez : sudo apt install build-essential
Puis : sudo apt update
Ensuite tapez : sudo apt install clang
Pour installer php : sudo apt install php
puis pour ajouter le github : git clone https://github.com/d4wae89d498/UTC503-TP --recursive && cd UTC503-TP
ensuite https://shaiya.fr/UTC503-TP/client/.

Good Game !