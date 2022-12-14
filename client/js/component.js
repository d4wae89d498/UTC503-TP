const componentIDPrefix = "COMPONENT_";

window['components'] = [];

function get_component(uid) {
    return window['components'][uid]; 
}

class Component 
{
//    uid = null;
//    hidden = false;
    constructor()
    {
        this.uid = guid();
        window['components'][this.uid] = this;
    }

    /* virtual */ async render()
    {
        return ``;
    }


    show()
    {
        document.getElementById(componentIDPrefix + this.uid).classList.remove("hide");   
        this.hidden = false;
        if (this.afterUpdate)
            this.afterUpdate();
    }

    hide()
    {
        document.getElementById(componentIDPrefix + this.uid).classList.add("hide"); 
        this.hidden = true;
        if (this.afterUpdate)
            this.afterUpdate(); 
    }

    async renderOuterHtml() 
    {
        return `
        <div id="${componentIDPrefix}${this.uid}" class="${this.hidden ? "hide" : ""}">
            ${await this.render()}
        </div>
        `;
    }

    async update()
    {
        if (document.getElementById(componentIDPrefix + this.uid))
            document.getElementById(componentIDPrefix + this.uid).outerHTML = await this.renderOuterHtml();
        if (this.afterUpdate)
            this.afterUpdate();
    }
}