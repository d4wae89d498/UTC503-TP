function hookHyperLinks() {
    const a_tags = document.getElementsByTagName('a');
    for (let key in a_tags) {
        a_tags[key].onclick = function (e) {
            console.log("href : ", this.href);
            window.history.pushState({}, '', this.href);
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
        console.log('a hooked');
    }
}

