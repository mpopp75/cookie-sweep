async function clearCookies() {
  return await Promise.all([
    browser.storage.local.get("domains"),
    browser.cookies.getAll({}),
    // this exists only for aesthetic reasons (popup window has time to show)
    new Promise((resolve, reject) => {
      setTimeout(resolve, 1000, "testing");
    })
  ])
  .then(items => // namify the values returned by promises, process errors
    { return { domains: items[0].domains, cookies: items[1] }
    },
    (error => console.log(`Failed to read config or cookies: ${error}`)))
  .then(items => {
    var domains = items.domains;
    var cookies = items.cookies;
    var kept=0, removed=0;

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

    return {kept:kept, removed:removed};
  });
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
