/*
* Custom Action CustomActionSendKB: Posts KB article link to conversation control
* @params  kblink : KB article Link
*/
window.top.CustomActionSendKB = function (params) {
    return new Promise(function (resolve, reject) {
        var evt = new CustomEvent("onsendkbarticle", {
            "detail": {
                "title": "KB Article",
                "link": params.kblink
            }
        });
        window.top.dispatchEvent(evt);
        resolve("Applied!");
    });
}

/*
* Custom Action CustomActionSendKB: Opens up a KB article in a separate browser tab
* @params  linktoopen : KB article Link 
*/
window.top.CustomActionOpenURL = function (params) {
    return new Promise(function (resolve, reject) {
        window.open(params.linktoopen);
        resolve("Applied!");
    });
}