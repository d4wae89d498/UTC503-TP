let id = "-1";
let name = localStorage.getItem("name") ?? "";
let opponent = "";
let socket = null;
let roomsInterval = null;

function get_packet(event, type) {
    if (event.data.length >= type.length && event.data.substr(0, type.length) == type) {
        let r = event.data.substr(type.length, event.data.length - type.length);
        if (!r.length)
            return true;
        return r;
    }
    return (0);
}

function onDestroyTikTakToe(){
    if (socket)
        socket.close();
    socket = null;
    clearInterval(roomsInterval);
    roomsInterval = null;
}


function onRenderTikTakToe(){
    socket = new WebSocket("ws://127.0.0.1:8080");
    
    socket.onopen = (e) => {
        console.log("[open] Connection established");
        if (!name.length) {
            name = prompt("Choisissez un pseudonyme : ", name);
            socket.send("NAME" + name);
            document.getElementsByClassName("pseudo0")[0].innerText = name;
        }
    };

    socket.onmessage =  (event) => {
        let packet_data;
        console.log(`[message] Data received from server: ${event.data}`);
        // HANDLE THE UUID BASED AUTH - TOKEN0123456789
        if (packet_data = get_packet(event, "TOKEN") !== 0)
            localStorage.setItem("token", packet_data);
        else if (packet_data = get_packet(event, "ROOM")) {
            let html = "";
            let rooms = packet_data.split("ROOM-").splice(1);
            for (const i in rooms) {
                let names = rooms[i].split("-");
                if (names.length == 1)
                    html += `<li><a href="#" onclick="chooseOp(this.innerText)">${names[0]}</a></li>`;
                else {
                    console.log(names);
                    html += `<li>${names[0]} - ${names[1]}</li>`;
                }
            }
            document.getElementById("rooms_list").innerHTML = html;
        }
        // SET PLAYER POSITIONS (first or second) - CURRENT0 or CURRENT1
        else if (packet_data = get_packet(event, "CURRENT")) {
            id = packet_data;
            document.getElementById("pseudo0").classList.remove("current");
            document.getElementById("pseudo1").classList.remove("current");
            document.getElementById("pseudo" + (id)).classList.add("current");
        }
        // HANDLE A MOVE : MOVE0-1-2 for moving plyer 0 in 1-2
        else if (packet_data = get_packet(event, "MOVE")) {
            //   let s = packet_data.split("C");
            //   s[0].replace('L', ""); 
            // collonnes lignes
            let s = packet_data.split("-");


            document.getElementById("L" + s[1] + "C" + s[2]).innerText = (s[0] == "0" ? "o" : "x");
            if (s[0] == "0") {
                document.getElementById("L" + s[1] + "C" + s[2]).classList.add("croix");
            }
            else {
                document.getElementById("L" + s[1] + "C" + s[2]).classList.add("rond");
            }
            // add class croix et class rond
        }
        // HANDLE A SCORE : SCORE1-2 for setting score of 1 to 2
        else if (packet_data = get_packet(event, "SCORE")) {
            let s = packet_data.split("-");
            document.getElementById("score" + s[0]).innerText = s[1];
        }
        // HANDLE A PSEUDONYME : PSEUDO0-ANYTHINGUNTIOL\0
        else if (packet_data = get_packet(event, "PSEUDO")) {
            let s = packet_data.split("-");
            document.getElementsByClassName("pseudo" + s[0])[0].innerText = s[1];;
        }
        else if (packet_data = get_packet(event, "OPPONENT_NOT_FOUND")) {
            alert("L'adversaire n'a pas été trouvé! Merci de vérifier le pseudonyme");
        }
        // HANDLE A ROOM : OPPONENT0123456789
        else if (packet_data = get_packet(event, "OPPONENT")) {
            opponent = packet_data;
        }
        else if (packet_data = get_packet(event, "CLEAR")) {
            let items = document.getElementsByClassName("Cases");
            let i = 0;
            while (i < items.length) {
                items[i].innerText = "";
                items[i].classList.remove("croix");
                items[i].classList.remove("croix");
                i += 1;
            }
        }
        // HANDLE A ROOM : ROOM0123456789
        else if (packet_data = get_packet(event, "WINNER")) {
            alert("Vous avez gagné!");
        }// HANDLE A ROOM : ROOM0123456789
        else if (packet_data = get_packet(event, "LOOSER")) {
            alert("Vous avez perdu!");
        }
        else if (packet_data = get_packet(event, "EQUAL")) {
            alert("Match nul!");
        }
        // HANDLE A CHAT : CHAT0-ANYTHINGUNTIL\0 
        else if (packet_data = get_packet(event, "CHAT")) {
            let s = packet_data.split("-");
            document.getElementsByClassName("messages")[0].innerHTML +=
                `<span class="pseudo${s[0]}">${new Date().getHours}:${new Date().getMinutes()} ${document.getElementById("pseudo" + s[0]).innerText}:</span>
        <span>${s1}</span> <hr/>`;
        }
        // HANDLE A CHAT : CHAT0-ANYTHINGUNTIL\0 
        else if (packet_data = get_packet(event, "ILLEGAL")) {
            alert("Mouvement interdit! Merci de jouer ailleurs");
        }
        else if (packet_data = get_packet(event, "NOT_YOU")) {
            alert("CE n;est pas votre tour! Merci d'attendre votre tour");
        }
    };
    socket.onclose = (event) => {
        if (!event.wasClean)
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        else
            console.log('[close] Connection died');

    };
    socket.onerror = (error) => {
        console.log(`[error] ${error.message}`);
    };
    console.log("cases:");
        var i = 0;
        while (i < document.getElementsByClassName("Cases").length) {
            document.getElementsByClassName("Cases")[i].onclick = function () {
                let s = this.id.split("C");
                s[0] = s[0].replace('L', "");
                socket.send("MOVE" + s[0] + "-" + s[1]);
            }
            i += 1;
        }

};

function chooseOp(str) {
    //  alert('op');

    socket.send("OPPONENT" + str);
    hideRooms();
}

function showRooms() {
    document.getElementsByClassName("rooms")[0].classList.remove("hide")
    roomsInterval = setInterval(() => {
        socket.send("ROOMS");
    }, 777);

}

function hideRooms() {
    document.getElementsByClassName("rooms")[0].classList.add("hide")
    clearInterval(roomsInterval);
}

function showChat() {
    document.getElementsByClassName("chat")[0].classList.remove("hide")
}

function hideChat() {
    document.getElementsByClassName("chat")[0].classList.add("hide")
}

function showMenu() {
    document.getElementsByClassName("menu")[0].classList.remove("hide")
}

function hideMenu() {
    document.getElementsByClassName("menu")[0].classList.add("hide")
}

console.log("TIKTAKTOE LOADED!!!");

class TikTakToePage {
    matchPathname;
    onRender;

    checkPathname() {
        socket;

        if (window.location.pathname == this.matchPathname) {
            onDestroyTikTakToe();
            this.render();
            return true;
        }
        return false;
    }

    constructor(webRoot, onRender) {
        this.matchPathname = webRoot + "tiktaktoe";
        this.onRender = onRender;
        window.addEventListener('nav::tick', function (e) {
            if (this.checkPathname())
                e.stopImmediatePropagation();
        }.bind(this))
        this.checkPathname();
    }

    render() {
        document.getElementsByTagName("body")[0].innerHTML =
            `
     <link rel="stylesheet" href="css/tiktaktoe.css">
    <script type="text/javascript" src="js/tiktaktoe.js"></script>
    <table id="entete">
        <tr>
            <td id="btn_page0" class = "pages" ><a class="btn_page" href="/">Jeux</a></td>
            <td id="btn_page1" class = "pages" onclick="showChat()">Chat</td>
            <td id="btn_page1" class = "pages" onclick="showRooms()">Salles</td>
            <td id="btn_page2" class = "pages" onclick="showChat()">Nouvelle partie</td>
        </tr>
    </table>
    <div class="pages" style="margin:auto;" onclick="">
        <br/>
        <center style="color: white;">
            <span class="pseudo0" id="pseudo0"></span> <span id="score0">0</span>
            <span class="pseudo1" id="pseudo1"></span> <span id="score1">0</span>
        </center>
        <br/>
    </div>
</header>
<body>
    <div class="menu hide" >
        <button onclick="hideMenu()">X</button>
        <div class="menuitems">
            <br/>
            <center>
                <h1>Menu</h1>
                <br/>
                <br/>
                <ul>
                    <li><a href="#"><strong>Morpion</strong></a></li>
                    <li><a href="#">Puissance 4</a></li>
                </ul>
            </center> 
        </div>
    </div>
    <div class="rooms hide" >
        <button onclick="hideRooms()">X</button>
        <div class="menuitems">
            <br/>
            <center>
                <h1>Salles</h1>
                <br/>
                <br/>
                <ul id="rooms_list">
                    <li> . . .</li>
                </ul>
            </center> 
        </div>
    </div>
        <div class="chat hide" >
            <button onclick="hideChat()">X</button>
            <br/>
            <center>
                <h1>Messages</h1>
            </center>
            <div class="messages">
                
            </div>
            <input type="text"/><button style="display:inline-block">ENVOYER</button>
        </div>
          <div class="square">
            <table id="grille" border="1">
                <tr id ="L1">
                    <td id="L1C1" class ="Cases"></td>
                    <td id="L1C2" class ="Cases"></td>
                    <td id="L1C3" class ="Cases"></td>
                </tr>
                <tr id ="L2">
                    <td id="L2C1" class ="Cases"></td>
                    <td id="L2C2" class ="Cases"></td>
                    <td id="L2C3" class ="Cases"></td>
                </tr>
                <tr id ="L3">
                    <td id="L3C1" class ="Cases"></td>
                    <td id="L3C2" class ="Cases"></td>
                    <td id="L3C3" class ="Cases"></td>
                </tr>
            </table>
          </div>
       
    <footer>
    </footer>
    <script>
        endPage();
    </script>
        `;
        this.onRender();
        onRenderTikTakToe();
       
    };
}