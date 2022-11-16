class TikTakToePage extends Page
{
 //   init;
    checkUrl()
    {
        if (webRoot + "tiktaktoe" == window.location.pathname)
        {
            this.init = true;
            return true;
        }
        this.init = false;
        this.destroyTikTakToekSocket();
        return false; 
    }

    async afterUpdate()
    {
        if (this.init)
        {
            this.initTikTakToeSocket();
            this.init = false;
        }
    }

    destroyTikTakToekSocket()
    {
        if (this.tikTakToeSocket)
            this.tikTakToeSocket.close();
        this.tikTakToeSocket = null;

    }

    initTikTakToeSocket()
    {
    	console.log("server=", server_tiktaktoe);
        this.tikTakToeSocket = initCommonProtocolSocket(server_tiktaktoe);
    }

    async render()
    {
        return `
        <style>
            ${await (((await fetch(webRoot + 'css/tiktaktoe.css'))).text())}
        </style> 
        ${await new TopMenu().renderOuterHtml()}
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
        `;
    };
}
