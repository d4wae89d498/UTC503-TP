class App 
{
    constructor(container, pages)
    {
        for (const i in pages)
        {
            new pages[i](container);
        }
    }
}