class Puissance4Page
{
    render()
    {
        `<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="css/puissance4.css">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puissance 4</title>
</head>
    <header>
        <table id="entete">
            <tr>
                <td id="btn_page0" class = "pages" ><a class="btn_page" href="index.html">Jeux</a></td>
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
    </header>
    <body>
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
    </body>
</html>
`;
    }
}
