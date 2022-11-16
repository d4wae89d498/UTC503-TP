class IndexPage extends Page 
{
    checkUrl()
    {
        return webRoot === window.location.pathname;
    }

    render()
    {
        return `<header>
            <div id="hautdepage">
                <h1 id="titre">Le passe temps du CNAM</h1>      
                <h2 id="titre2">Choisis ton jeu</h2>    
            </div>
        </header>
        <div id="table">
            <table>
                <tr>
                    <td  id="Morpion" class = "pages"><span><a class="bouton" href="tiktaktoe">Morpion</a></span></td>
                    <td  id="Puissance4" class = "pages"><a class="bouton" href="puissance4.html">Puissance 4</a></td>
                </tr>
            </table>
        </div>`;
    }
}