function onStorageChanged() {
    runMain();
}

function runMain() {
    clearCookies()
    .then(stats => {
      console.log("count.kept: " + stats.kept);
      console.log("count.removed: " + stats.removed);

      document.getElementById("processing").remove();

      var para1 = document.createElement("p");
      var node1 = document.createTextNode(parseInt(stats.kept) + " Cookies kept.");
      para1.appendChild(node1);

      var para2 = document.createElement("p");
      var node2 = document.createTextNode(parseInt(stats.removed) + " Cookies removed.");
      para2.appendChild(node2);

      document.getElementById("output").appendChild(para1);
      document.getElementById("output").appendChild(para2);
    });
}

function handleMessage(request, sender, sendResponse) {

    sendResponse(statistics);
}

document.addEventListener("DOMContentLoaded", runMain);
browser.runtime.onMessage.addListener(handleMessage);
browser.storage.onChanged.addListener(onStorageChanged);
