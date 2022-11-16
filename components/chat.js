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
            <div class="messages"></div>
            <center>
                <input type="text"/><button style="display:inline-block">ENVOYER</button>
            </center>
        </div>`; 
    }
            
}