class Chat extends Component
{
 //   hidden = true;
    constructor()
    {
        super();
        this.hidden = true;

        window['sendChat'] = (e) => {
            console.log(e)
            if (e && e.keyCode && e.keyCode != 13)
                return ;
            socket.send('MSG'+document.getElementById('chattext').value);  
            document.getElementById('chattext').value = '';
        }
    }  

    async render() 
    {
        return `<div class="chat">
            <button id="btnhidechat" class="intromenuchat" onclick="get_component('${this.uid}').hide()">X</button>
            <h1 id="titrechat" class="intromenuchat">Messages</h1>
            <div class="messages">
            </div>
            <center>
                <input type="text" id="chattext" onkeyup="sendChat(event)" autofocus/><button style="display:inline-block" onclick="sendChat()">ENVOYER</button>
            </center>
        </div>`; 
    }
            
}