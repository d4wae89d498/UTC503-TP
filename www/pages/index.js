class IndexPage
{    
    matchPathname;
    onRender;

    checkPathname()
    {
        if (window.location.pathname == this.matchPathname)
        {
            this.render();
            return true;
        }
        return false;
    }

    constructor(webRoot, onRender)
    {
        this.matchPathname = webRoot;
        this.onRender = onRender;
        window.addEventListener('nav::tick', function(e) {
            if (this.checkPathname()) 
                e.stopImmediatePropagation();
        }.bind(this))
        this.checkPathname();
    }

    render()
    {
        document.getElementsByTagName("body")[0].innerHTML = 
        `
    <header>
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
    </div>
        `;
        this.onRender();
    };
}