
let id;
let name = localStorage.getItem("name") ?? "";
let opponent;
let roomsInterval;
let socket = null;
let moves = 0;
let isFirst = 0;

function askName()
{
    name = prompt("Choisissez un pseudonyme : ", name);
    socket.send("NAME" + name);        
    localStorage.setItem("name", name);
}

function initCommonProtocolSocket(url)
{
    if (socket)
        return ;
    socket = new WebSocket(url);
    console.log("socket: ", socket);

    id = "-1";
    opponent = "";
    roomsInterval = null;

    socket.onopen = (e) => {
        console.log("[open] Connection established");
        askName(); 
    };

    window['chooseOp'] = (str) => {
        let rooms = document.getElementsByClassName("roomc"); 
        for (const i in rooms)
        {
            if (rooms[i].classList)
                rooms[i].classList.add('hide')
        }
        socket.send("OPPONENT"+str);
    }

    window['askRooms'] = (str) => {
        if (socket)
            socket.send("ROOMS");
    }


    window['askChat'] = (str) => {
        socket.send("GETCHAT");
    }


    socket.onmessage = (event) => {
        let packet_data;
        console.log(`[message] Data received from server: ${event.data}`);
        if (packet_data = get_packet(event, "NAME_IN_USE")) {
            alert("Le nom est deja utilise !");
            askName();
        }
        else if (packet_data = get_packet(event, "NAME_ACK")) {
            document.getElementsByClassName("pseudo0")[0].innerText = name;
        } 
        else if (packet_data = get_packet(event, "ROOM-")) {
            let html = "";
            let rooms = packet_data.split("ROOM-");
            for (const i in rooms) {
                let names = rooms[i].split("-");
                if (names.length == 1)
                    html += `<li><a href="" class="roomc">${names[0]}</a></li>`;
                else {
                    console.log(names);
                    html += `<li>${names[0]} - ${names[1]}</li>`;
                }
            }
            document.getElementById("rooms_list").innerHTML = html;
            let roomsLinks =document.getElementsByClassName("roomc"); 
            for (const i in roomsLinks)
            {
                roomsLinks[i].onclick = function(e) {
                    chooseOp(this.innerText);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false; 
                }
            }
        }
        // SET PLAYER POSITIONS (first or second) - CURRENT0 or CURRENT1
        else if (packet_data = get_packet(event, "CURRENT")) {
            id = packet_data;
            if (!moves)
            {
                if (id == '0')
                {
                    document.getElementById("pseudo1").classList.remove("croix_p");
                    document.getElementById("pseudo1").classList.add("rond_p");

                    document.getElementById("pseudo0").classList.remove("rond_p");
                    document.getElementById("pseudo0").classList.add("croix_p");    
                }
                else 
                {
                    document.getElementById("pseudo0").classList.remove("croix_p");
                    document.getElementById("pseudo0").classList.add("rond_p");

                    document.getElementById("pseudo1").classList.remove("rond_p");
                    document.getElementById("pseudo1").classList.add("croix_p");      
                }
             
            }
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


            document.getElementById("L" + s[1] + "C" + s[2]).innerText = !(moves % 2) ?  "x" : "o";
            if (!(moves % 2)) {
                document.getElementById("L" + s[1] + "C" + s[2]).classList.remove("rond");
                document.getElementById("L" + s[1] + "C" + s[2]).classList.add("croix");
            }
            else {
                document.getElementById("L" + s[1] + "C" + s[2]).classList.remove("croix");
                document.getElementById("L" + s[1] + "C" + s[2]).classList.add("rond");
            }

            moves += 1;
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
            moves = 0;
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
        else if (packet_data = get_packet(event, "MSG")) {
            let s = packet_data.split("-");
            document.getElementsByClassName("messages")[0].innerHTML +=
                `<span class="pseudo${s[0]}">${new Date().getHours()}:${new Date().getMinutes()} ${s[0]}:</span>
        <span>${s[1]}</span> <hr/>`;
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
            //alert('clicked')
            let s = this.id.split("C");
            s[0] = s[0].replace('L', "");
            socket.send("MOVE" + s[0] + "-" + s[1]);
        }
        i += 1;
    }

    return socket;
}