class TikTakToePage extends Page
{
 //   init;
    checkUrl()
    {
        if (webRoot + "tiktaktoe" == window.location.pathname)
        {
            this.afterUpdate = () =>
            {
                this.destroyTikTakToekSocket();
                if (!this.tikTakToeSocket)
                    this.tikTakToeSocket = initCommonProtocolSocket(server_tiktaktoe);           
                }
            return true;
        }
        this.destroyTikTakToekSocket();
        return false; 
    }

    destroyTikTakToekSocket()
    {
        if (this.tikTakToeSocket)
            this.tikTakToeSocket.close();
        this.tikTakToeSocket = null;

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
