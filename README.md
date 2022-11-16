## TP Grille

Par Jérémy, Alexis, Marc

- Server : C++ 11 with [wsServer](https://github.com/Theldus/wsServer) as only external lib
- Client : JS ECMAScript 2015 wihout any external lib (the entire front-end framework is home-made)
- User interface : HTML / CSS
- Communication Protocol : WebSocket

Usage : (requires an UNIX OS)
- git clone .... UTC503-TP && cd UTC503-TP && make
- ./tiktaktoe_server (keep server open and don't close the terminal)
- open a new terminal, cd client && php -S 127.0.0.1:8667 (this is a nice way to open a local HTTP server, you may also use NGINX, Appache or anything else)
- open a browser and navigate to http://127.0.0.1:8667

TODO :

- [ ] clean global components var in front end framework
- [ ] tiktaktoe refactor
- [ ] puissance4
