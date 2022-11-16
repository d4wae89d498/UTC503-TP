class TopMenu extends Component
{
    async render()
    {
        let chat = new Chat();
        let rooms = new Rooms();

        return `
        <header style="margin-top: -1px;">
            <center>
                <table id="entete">
                    <tr>
                        <td id="btn_page0" class = "pages" ><a class="btn_page" href="/">Jeux</a></td>
                        <td id="btn_page1" class = "pages" onclick="get_component('${chat.uid}').show()">Chat</td>
                        <td id="btn_page1" class = "pages" onclick="get_component('${rooms.uid}').show()">Salles</td>
                        <td id="btn_page2" class = "pages" onclick="showChat()">Nouvelle partie</td>
                    </tr>
                </table>
                <div class="pages" style="margin:auto;">
                    <br/>
                    <center style="color: white;">
                        <span id="score0">0</span><span class="pseudo0" id="pseudo0"></span>
                        <span class="pseudo1" id="pseudo1"></span> <span id="score1">0</span>
                    </center>
                    <br/>
                </div>
            </center>
        </header>
        ${await chat.renderOuterHtml()}
        ${await rooms.renderOuterHtml()}
        `;
    }
}