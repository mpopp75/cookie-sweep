var domains = null;

function buttonClicked() {
    var getting = browser.cookies.getAll({});

    getting.then(clearCookies);
}

function clearCookies(cookies) {

    var domainsArray = domains.split(",");

    for (var cookie of cookies) {
        var deleteCookie = true;
        for (var d of domainsArray) {
            d = d.trim();

            if (cookie.domain.endsWith('.' + d)) {
                // keep cookie
                console.log("KEEP " + cookie.domain + " --- " + cookie.name);
                deleteCookie = false;
            }
        }

        if (deleteCookie === true) {
            var removingHttp = browser.cookies.remove({
                url: "http://" + cookie.domain,
                name: cookie.name
            });
            removingHttp.then(onCookieRemoved, onCookieError);

            var removingHttps = browser.cookies.remove({
                url: "https://" + cookie.domain,
                name: cookie.name
            });
            removingHttps.then(onCookieRemoved, onCookieError);
            console.log("REMOVE " + cookie.domain + " --- " + cookie.name);
        }
    }
}

function onStorageError(error) {
  console.log(`Error: ${error}`);
}

function onStorageGot(item) {
    domains = item.domains;
}

function onCookieRemoved(cookie) {
    try {
        console.log("REMOVED " + cookie.name);
    } catch (e) {}
    return;
}

function onCookieError(error) {
    console.log(`Error removing cookie: ${error}`);
}

function storageChanged() {
    var getting = browser.storage.local.get("domains");
    getting.then(onStorageGot, onStorageError);
}

var getting = browser.storage.local.get("domains");
getting.then(onStorageGot, onStorageError);

browser.browserAction.onClicked.addListener(buttonClicked);
browser.storage.onChanged.addListener(storageChanged);