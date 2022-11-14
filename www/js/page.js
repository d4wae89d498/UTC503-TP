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

    constructor(container)
    {
        this.container = container;
        window.addEventListener('nav::tick',  (e) => {this.updateIfCheckUrl(e)})
        this.updateIfCheckUrl();
    }

    /* virtual */ checkUrl()
    {
        return false;
    }

    /* virtual */ async afterUpdate()
    {

    }

    /* virtual */ async render()
    {
        return ``;
    }

    async update()
    {
        document.getElementById( this.container ).innerHTML =  await this.render();
        hookHyperLinks();
        await this.afterUpdate(); 
    }

}