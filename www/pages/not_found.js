class NotFoundPage
{
    onRender;
    
    constructor(webRoot, onRender)
    {
        this.onRender = onRender;
        window.addEventListener('nav::tick', function(e) {
            this.render();
        }.bind(this))
    }

    render()
    {
        document.getElementsByTagName("body")[0].innerHTML = 
        `
            <center>
                <font color="white">
                    404 ERROR - <a href="/">Home</a>
                </font>        
            </center>
        `
        this.onRender();
    };
}