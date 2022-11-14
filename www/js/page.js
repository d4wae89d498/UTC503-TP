class Page 
{
    updateIfCheckUrl(e)
    {
        if (this.checkUrl()) 
        {
            this.update();
            if (e)
                e.stopImmediatePropagation();
        }
    }

    constructor()
    {
        window.addEventListener('nav::tick',  (e) => {this.updateIfCheckUrl(e)})
        this.updateIfCheckUrl();
    }

    checkUrl()
    {
        return false;
    }

    async afterUpdate()
    {

    }

    async render()
    {
        return ``;
    }

    async update()
    {
        document.getElementById( window['appContainer'] ).innerHTML =  await this.render();
        hookHyperLinks();
        await this.afterUpdate(); 
    }

}