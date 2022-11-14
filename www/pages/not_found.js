class NotFoundPage
{


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
    };
}