class IndexPage extends Page 
{
    checkUrl()
    {
        return webRoot === window.location.pathname;
    }

    render()
    {
        socket = null;
        return `<header>
            <div id="hautdepage">
                <h1 id="titre">Le passe temps du CNAM</h1>      
                <h2 id="titre2">Choisis ton jeu</h2>    
            </div>
        </header>
        <div id="table">
            <table>
                <tr>
                    <td  id="Morpion" class = "pages"><a class="bouton" href="tiktaktoe"><span>Morpion</span><br/>
                        <img src="./img/tiktaktoe.png" style="width: 40vw; max-width: 400px; aspect-ratio: 1/1;" /></a>
                    </td>
                    <td  id="Puissance4" class = "pages"><a class="bouton" href="puissance4"><span>Puissance 4</span><br/>
                        <img src="./img/puissance4.jpg" style="width: 40vw; max-width: 400px; aspect-ratio: 1/1;" /></a>
                    </td>
                </tr>
            </table>
        </div>`;
    }
}