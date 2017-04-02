!function(window, undefined) {
    function moduleA() {
        return "moduleA";
    }
    var console = (window.document, window.history, window.location, window.navigator, 
    window.console);
    window.alert, window.confirm, window.Image, window.setTimeout, window.clearTimeout, 
    window.setInterval, window.clearInterval, window.getComputedStyle, window.encodeURIComponent, 
    window.decodeURIComponent, window.localStorage, window.sessionStorage, window.String, 
    window.Array, window.Object, window.Date, window.XMLHttpRequest, window.Node, window.NodeList, 
    window.HTMLElement, window.HTMLCollection, window.applicationCache;
    console.log("enter module-a"), moduleA(), console.log("success!");
}(window);
