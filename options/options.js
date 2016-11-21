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

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);