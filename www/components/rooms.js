class Rooms extends Component
{
//    hidden = true;
    constructor()
    {
        super();
        this.hidden = true;
    }

    async afterUpdate()
    {
        if (!this.hidden && !roomsInterval)
        {
            roomsInterval = setInterval(() => 
            {
                askRooms();
            }, 333);
        }
        else if (this.hidden && roomsInterval)
        {
            clearInterval(roomsInterval);
            roomsInterval = null;
        }
    }

    async render()
    {
        return `
        <div class="rooms" >
            <h1 id="titresalles"style="display: inline-block; margin-top: 0;margin-bottom: 0; ">Salles</h1>
            <button style="vertical-align: top;float: right;" onclick="get_component('${this.uid}').hide()">X</button>
            <div class="menuitems">
            <br/>
            <center>
                <br/>
                <br/>
                <ul id="rooms_list">
                    <li>  ... </li>
                </ul>
            </center> 
        </div> 
        </div>`;
    }
}