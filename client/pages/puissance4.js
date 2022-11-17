class Puissance4Page extends Page
{
 //   init;
    checkUrl()
    {
        if (webRoot + "puissance4" == window.location.pathname)
        {
            this.init = true;
            return true;
        }
        this.init = false;
        this.destroyPuissance4kSocket();
        return false; 
    }

    async afterUpdate()
    {
        if (this.init)
        {
            this.initPuissance4Socket();
            this.init = false;
        }
    }

    destroyPuissance4kSocket()
    {
        if (this.Puissance4Socket)
            this.Puissance4Socket.close();
        this.Puissance4Socket = null;

    }

    initPuissance4Socket()
    {
    	console.log("server=", server_puissance4);
        this.Puissance4Socket = initCommonProtocolSocket(server_puissance4);
    }

    async render()
    {
        return `
        <style>
            ${await (((await fetch(webRoot + 'css/puissance4.css'))).text())}
        </style> 
        ${await new TopMenu().renderOuterHtml()}
        <div class="square">
            <table id="grille" border="1">
                <tr id ="L1">
                    <td id="L1C1" class ="Cases"></td>
                    <td id="L1C2" class ="Cases"></td>
                    <td id="L1C3" class ="Cases"></td>
                    <td id="L1C4" class ="Cases"></td>
                    <td id="L1C5" class ="Cases"></td>
                    <td id="L1C6" class ="Cases"></td>
                    <td id="L1C7" class ="Cases"></td>
                </tr>
                <tr id ="L2">
                    <td id="L2C1" class ="Cases"></td>
                    <td id="L2C2" class ="Cases"></td>
                    <td id="L2C3" class ="Cases"></td>
                    <td id="L2C4" class ="Cases"></td>
                    <td id="L2C5" class ="Cases"></td>
                    <td id="L2C6" class ="Cases"></td>
                    <td id="L2C7" class ="Cases"></td>
                </tr>
                <tr id ="L3">
                    <td id="L3C1" class ="Cases"></td>
                    <td id="L3C2" class ="Cases"></td>
                    <td id="L3C3" class ="Cases"></td>
                    <td id="L3C4" class ="Cases"></td>
                    <td id="L3C5" class ="Cases"></td>
                    <td id="L3C6" class ="Cases"></td>
                    <td id="L3C7" class ="Cases"></td>
                </tr>
                <tr id="L4">
                    <td id="L4C1" class ="Cases"></td>
                    <td id="L4C2" class ="Cases"></td>
                    <td id="L4C3" class ="Cases"></td>
                    <td id="L4C4" class ="Cases"></td>
                    <td id="L4C5" class ="Cases"></td>
                    <td id="L4C6" class ="Cases"></td>
                    <td id="L4C7" class ="Cases"></td>
                </tr>
                <tr id="L5">
                    <td id="L5C1" class ="Cases"></td>
                    <td id="L5C2" class ="Cases"></td>
                    <td id="L5C3" class ="Cases"></td>
                    <td id="L5C4" class ="Cases"></td>
                    <td id="L5C5" class ="Cases"></td>
                    <td id="L5C6" class ="Cases"></td>
                    <td id="L5C7" class ="Cases"></td>
                </tr>
                <tr id="L6">
                    <td id="L6C1" class ="Cases"></td>
                    <td id="L6C2" class ="Cases"></td>
                    <td id="L6C3" class ="Cases"></td>
                    <td id="L6C4" class ="Cases"></td>
                    <td id="L6C5" class ="Cases"></td>
                    <td id="L6C6" class ="Cases"></td>
                    <td id="L6C7" class ="Cases"></td>
                </tr>
            </table>
          </div>
        `;
    };
}


/*
    async render()
    {
        return `
        <style>
            ${await (((await fetch(webRoot + 'css/Puissance4.css'))).text())}
        </style> 
        ${await new TopMenu().renderOuterHtml()}
        <div class="square">
            <table id="grille" border="1">
                <tr id ="L1">
                    <td id="L1C1" class ="Cases"></td>
                    <td id="L1C2" class ="Cases"></td>
                    <td id="L1C3" class ="Cases"></td>
                    <td id="L1C4" class ="Cases"></td>
                    <td id="L1C5" class ="Cases"></td>
                    <td id="L1C6" class ="Cases"></td>
                    <td id="L1C7" class ="Cases"></td>
                </tr>
                <tr id ="L2">
                    <td id="L2C1" class ="Cases"></td>
                    <td id="L2C2" class ="Cases"></td>
                    <td id="L2C3" class ="Cases"></td>
                    <td id="L2C4" class ="Cases"></td>
                    <td id="L2C5" class ="Cases"></td>
                    <td id="L2C6" class ="Cases"></td>
                    <td id="L2C7" class ="Cases"></td>
                </tr>
                <tr id ="L3">
                    <td id="L3C1" class ="Cases"></td>
                    <td id="L3C2" class ="Cases"></td>
                    <td id="L3C3" class ="Cases"></td>
                    <td id="L3C4" class ="Cases"></td>
                    <td id="L3C5" class ="Cases"></td>
                    <td id="L3C6" class ="Cases"></td>
                    <td id="L3C7" class ="Cases"></td>
                </tr>
                <tr id="L4">
                    <td id="L4C1" class ="Cases"></td>
                    <td id="L4C2" class ="Cases"></td>
                    <td id="L4C3" class ="Cases"></td>
                    <td id="L4C4" class ="Cases"></td>
                    <td id="L4C5" class ="Cases"></td>
                    <td id="L4C6" class ="Cases"></td>
                    <td id="L4C7" class ="Cases"></td>
                </tr>
                <tr id="L5">
                    <td id="L5C1" class ="Cases"></td>
                    <td id="L5C2" class ="Cases"></td>
                    <td id="L5C3" class ="Cases"></td>
                    <td id="L5C4" class ="Cases"></td>
                    <td id="L5C5" class ="Cases"></td>
                    <td id="L5C6" class ="Cases"></td>
                    <td id="L5C7" class ="Cases"></td>
                </tr>
                <tr id="L6">
                    <td id="L6C1" class ="Cases"></td>
                    <td id="L6C2" class ="Cases"></td>
                    <td id="L6C3" class ="Cases"></td>
                    <td id="L6C4" class ="Cases"></td>
                    <td id="L6C5" class ="Cases"></td>
                    <td id="L6C6" class ="Cases"></td>
                    <td id="L6C7" class ="Cases"></td>
                </tr>
            </table>
          </div>
   
`;
    }
}
*/