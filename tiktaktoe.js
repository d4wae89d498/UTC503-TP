function get_packet(event, type)
{
    if (event.data.length >= type.length && event.data.substr(0,type.length) == type)
    {
        let r = event.data.substr(type.length, event.data.length - type.length);
        if (!r.length)
            return true;
        return r;
    }
    return (0);
}
let id = "-1";
let name = localStorage.getItem("name") ?? "";
let opponent = "";
let socket = new WebSocket("ws://127.0.0.1:8080");

function promptOpponent()
{
    opponent = prompt("Choisissez un opposant : ", opponent); 
    socket.send("OPPONENT" + opponent);
}

socket.onopen = function (e) {
    console.log("[open] Connection established");
    if (!name.length)
    {
        name = prompt("Choisissez un pseudonyme : ", name); 
        socket.send("NAME"+name);
        document.getElementsByClassName("pseudo0")[0].innerText = name;
    }
};
socket.onmessage = function (event) {
    let packet_data; 
    console.log(`[message] Data received from server: ${event.data}`);
    // HANDLE THE UUID BASED AUTH - TOKEN0123456789
    if (packet_data = get_packet(event, "TOKEN") !== 0)
        localStorage.setItem("token", packet_data);
    // SET PLAYER POSITIONS (first or second) - CURRENT0 or ID1
    else if (packet_data = get_packet(event, "CURRENT"))
    {
        id = packet_data;
        document.getElementById("pseudo0").classList.remove("current");
        document.getElementById("pseudo1").classList.remove("current");
        document.getElementById("pseudo" + (id)).classList.add("current");
    }
    // HANDLE A MOVE : MOVE0-1-2 for moving plyer 0 in 1-2
    else if (packet_data = get_packet(event, "MOVE"))
    {
        let s = packet_data.split("-");
        document.getElementById(s[1] + "-" + s[2]).innerText = (s[0] == "0" ? "o" : "x");
    }
    // HANDLE A SCORE : SCORE1-2 for setting score of 1 to 2
    else if (packet_data = get_packet(event, "SCORE"))
    {
        let s = packet_data.split("-");
        document.getElementById("score" + s[0]).innerText = s[1];
    }
    // HANDLE A PSEUDONYME : PSEUDO0-ANYTHINGUNTIOL\0
    else if (packet_data = get_packet(event, "PSEUDO"))
    {
        let s = packet_data.split("-");
        document.getElementsByClassName("pseudo" + s[0])[0].innerText = s[1];;
    }
     else if (packet_data = get_packet(event, "OPPONENT_NOT_FOUND"))
    {
        alert("L'adversaire n'a pas été trouvé! Merci de vérifier le pseudonyme");
    }
    // HANDLE A ROOM : OPPONENT0123456789
    else if (packet_data = get_packet(event, "OPPONENT"))
    {
        opponent = packet_data;
    }
    else if (packet_data = get_packet(event, "CLEAR"))
    {
        let items = document.getElementsByClassName("Cases");
        let i = 0;
        while (i < items.length)
        {
            items[i].innerText = "";
            i += 1;
        }
    } 
    // HANDLE A ROOM : ROOM0123456789
    else if (packet_data = get_packet(event, "WINNER"))
    {
        alert("Vous avez gagné!");
    }// HANDLE A ROOM : ROOM0123456789
    else if (packet_data = get_packet(event, "LOOSER"))
    {
        alert("Vous avez perdu!");
    }
    else if (packet_data = get_packet(event, "EQUAL"))
    {
        alert("Match nul!");
    }
    // HANDLE A CHAT : CHAT0-ANYTHINGUNTIL\0 
    else if (packet_data = get_packet(event, "CHAT"))
    {
        let s = packet_data.split("-");
        document.getElementsByClassName("messages")[0].innerHTML += 
        `<span class="pseudo${s[0]}">${new Date().getHours}:${new Date().getMinutes()} ${document.getElementById("pseudo"+s[0]).innerText}:</span>
        <span>${s1}</span> <hr/>`;
    }
     // HANDLE A CHAT : CHAT0-ANYTHINGUNTIL\0 
    else if (packet_data = get_packet(event, "ILLEGAL"))
    {
        alert("Mouvement interdit! Merci de jouer ailleurs");
    }
    else if (packet_data = get_packet(event, "NOT_YOU"))
    {
        alert("CE n;est pas votre tour! Merci d'attendre votre tour");
    }
};
socket.onclose = function (event) {
    if (!event.wasClean)
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    else
        console.log('[close] Connection died');
    
};
socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};

function showChat()
{
    document.getElementsByClassName("chat")[0].classList.remove("hide")
}

function hideChat()
{
    document.getElementsByClassName("chat")[0].classList.add("hide")
}

function showMenu()
{
    document.getElementsByClassName("menu")[0].classList.remove("hide")
}

function hideMenu()
{
    document.getElementsByClassName("menu")[0].classList.add("hide")
}

function endPage()
{
console.log("cases:");
var i = 0;
while (i < document.getElementsByClassName("Cases").length)
{
    document.getElementsByClassName("Cases")[i].onclick = function()
    {
        socket.send("MOVE"+this.id)
    }
    i += 1;
}
}
