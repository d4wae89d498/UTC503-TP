class Chat extends Component
{
 //   hidden = true;
    constructor()
    {
        super();
        this.hidden = true;
    }  

    async render() 
    {
        return `<div class="chat">
            <button id="btnhidechat" class="intromenuchat" onclick="get_component('${this.uid}').hide()">X</button>
            <h1 id="titrechat" class="intromenuchat">Messages</h1>
            <div class="messages">
            </div>
            <center>
                <input type="text" id="chattext"/><button style="display:inline-block" onclick="socket.send('MSG'+document.getElementById('chattext').value)">ENVOYER</button>
            </center>
        </div>`; 
    }
            
}