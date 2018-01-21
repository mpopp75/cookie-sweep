var saveTimer;
/* Save options async.
   The operation is delayed 1000ms so that it did not save on each key */
function saveOptions(e) {
  if(saveTimer) { clearTimeout(saveTimer); }
  saveTimer = setTimeout(saveOptionsSync, 1000);
};
/* Save options syncchronously (immediately). */
function saveOptionsSync() {
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
  var progressOld = document.getElementById("actionResult");
  var progress = progressOld.cloneNode(false);
  progressOld.parentNode.replaceChild(progress, progressOld);
  // Show progress indicator
  var paraP = document.createElement("p");
  var nodeP = document.createTextNode("Processing...");
  paraP.appendChild(nodeP);
  progress.appendChild(paraP);

  clearCookies()
  .then(stats => {
    console.log("count.removed: " + stats.removed);
    console.log("count.kept: " + stats.kept);

    paraP.remove();

    var para1 = document.createElement("p");
    var node1 = document.createTextNode(parseInt(stats.kept) + " cookies kept.");
    para1.appendChild(node1);

    var para2 = document.createElement("p");
    var node2 = document.createTextNode(parseInt(stats.removed) + " cookies removed.");
    para2.appendChild(node2);

    progress.appendChild(para2);
    progress.appendChild(para1);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
// document.querySelector("#save").addEventListener("click", saveOptions);
document.querySelector("#domains").addEventListener("input", saveOptions); // Autosave
window.addEventListener("blur", saveOptionsSync); // Autosave on window deactivate
document.querySelector("#runNow").addEventListener("click", runMain);
