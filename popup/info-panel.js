function onStorageChanged() {
    runMain();
}

function runMain() {
    clearCookies()
    .then(stats => {
      console.log("count.removed: " + stats.removed);
      console.log("count.kept: " + stats.kept);

      document.getElementById("processing").remove();

      var para1 = document.createElement("p");
      var node1 = document.createTextNode(parseInt(stats.kept) + " cookies kept.");
      para1.appendChild(node1);

      var para2 = document.createElement("p");
      var node2 = document.createTextNode(parseInt(stats.removed) + " cookies removed.");
      para2.appendChild(node2);

      document.getElementById("output").appendChild(para2);
      document.getElementById("output").appendChild(para1);
    });
}

document.addEventListener("DOMContentLoaded", runMain);
browser.storage.onChanged.addListener(onStorageChanged);
