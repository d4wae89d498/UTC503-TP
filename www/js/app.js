class App 
{
    constructor(container, pages)
    {
        window['appContainer'] = container;
        for (let i in pages)
        {
            new pages[i]();
        }
    }
}