class MenuComponent {
    id = null;

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    toString() {
        if (!this.id)
            this.id = this.guid();
        return `;
        <header id="D${this.id}">
           <table id="entete">
                <tr>
                    <td id="btn_page0" class = "pages" ><a class="btn_page" href="/">Jeux</a></td>
                    <td id="btn_page1" class = "pages" onclick="showChat()">Chat</td>
                     <td id="btn_page1" class = "pages" onclick="showRooms()">Salles</td>
                     <td id="btn_page2" class = "pages" onclick="showChat()">Nouvelle partie</td>
                 </tr>
        
             </table>
            <div class="pages" style="margin:auto;" onclick="promptOpponent()">
            <br/>
                <center style="color: white;">
                    <span id="score0">0</span><span class="pseudo0" id="pseudo0"></span>
                    <span class="pseudo1" id="pseudo1"></span> <span id="score1">0</span>
                </center>
                <br/>
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
       
        </header>
        `;
    }

    render() {
        document.getElementById("D" + this.guid).outerHTML = this.toString();
    }
}