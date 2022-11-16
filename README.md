## TP Grille

Par Jérémy, Alexis, Marc

- Server : C++ 11 with [wsServer](https://github.com/Theldus/wsServer) as only external lib
- Client : JS ECMAScript 2015 wihout any external lib (the entire front-end framework is home-made)
- User interface : HTML / CSS
- Communication Protocol : WebSocket

Demo : https://tsdretouches.fr/UTC503-TP/client

Usage : 

- git clone https://github.com/d4wae89d498/UTC503-TP && cd UTC503-TP && make
- ./tiktaktoe_server    (or/and ./puissance4_server)
- cd client && php -S 127.0.0.1:8667
- open a browser and navigate to http://127.0.0.1:8667

TODO :

- [ ] clean global components var in front end framework
- [ ] tiktaktoe refactor
- [ ] puissance4
