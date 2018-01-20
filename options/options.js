function saveOptions(e) {
  browser.storage.local.set({
    domains: document.querySelector("#domains").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#domains").value = result.domains || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("domains");
  getting.then(setCurrentChoice, onError);
}

function runMain() {
  // clear old progress if any
  var progressOld = document.getElementById("runNowResult");
  var progress = progressOld.cloneNode(false);
  progressOld.parentNode.replaceChild(progress, progressOld);
  // Show progress indicator
  var paraP = document.createElement("p");
  var nodeP = document.createTextNode("Processing...");
  paraP.appendChild(nodeP);
  progress.appendChild(paraP);

  clearCookies()
  .then(stats => {
    console.log("count.kept: " + stats.kept);
    console.log("count.removed: " + stats.removed);

    paraP.remove();

    var para1 = document.createElement("p");
    var node1 = document.createTextNode(parseInt(stats.kept) + " Cookies kept.");
    para1.appendChild(node1);

    var para2 = document.createElement("p");
    var node2 = document.createTextNode(parseInt(stats.removed) + " Cookies removed.");
    para2.appendChild(node2);

    progress.appendChild(para1);
    progress.appendChild(para2);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#runNow").addEventListener("click", runMain);
