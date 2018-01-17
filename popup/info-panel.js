var domains = null;
var kept = 0;
var removed = 0;

function clearCookies(cookies) {

    var domainsArray = domains.split(",").map(d => d.trim());

    for (var cookie of cookies) {
        var deleteCookie = true;
        for (var d of domainsArray) {
            if (cookie.domain === d || cookie.domain.endsWith('.' + d)) {
                // keep cookie
                console.log("KEEPING " + cookie.domain + cookie.path + " --- " + cookie.name);
                deleteCookie = false;
                kept++;
                break;
            }
        }

        if (deleteCookie) {
            var removingHttp = browser.cookies.remove({
                url: "http://" + cookie.domain + cookie.path,
                name: cookie.name
            });
            removingHttp.then(onCookieRemoved, onCookieError);

            var removingHttps = browser.cookies.remove({
                url: "https://" + cookie.domain + cookie.path,
                name: cookie.name
            });
            removingHttps.then(onCookieRemoved, onCookieError);
            console.log("REMOVING " + cookie.domain + cookie.path + " --- " + cookie.name);
            removed++;
        }
    }

    console.log("count.kept: " + kept);
    console.log("count.removed: " + removed);

    var para1 = document.createElement("p");
    var node1 = document.createTextNode(parseInt(kept) + " Cookies kept.");
    para1.appendChild(node1);

    var para2 = document.createElement("p");
    var node2 = document.createTextNode(parseInt(removed) + " Cookies removed.");
    para2.appendChild(node2);

    document.getElementById("output").appendChild(para1);
    document.getElementById("output").appendChild(para2);
}

function onStorageGot(item) {
    domains = item.domains;

    var getting = browser.cookies.getAll({});
    getting.then(clearCookies);
}

function onStorageError(error) {
  console.log(`Error: ${error}`);
}

function onCookieRemoved(cookie) {
    try {
        console.log("REMOVED " + cookie.domain + cookie.path + " --- " + cookie.name);
    } catch (e) {}
    return;
}

function onCookieError(error) {
    console.log(`Error removing cookie: ${error}`);
}

function storageChanged() {
    runMain();
}

function runMain() {
    var getting = browser.storage.local.get("domains");
    getting.then(onStorageGot, onStorageError);
}

runMain();

browser.storage.onChanged.addListener(storageChanged);
