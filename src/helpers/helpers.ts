function makeRequest(method: string, url: string) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    xhr.send();
  });
}

function getObjectValueFromPath(object: Record<string, unknown>, path: string) {
  return path.split(".").reduce((acc, curr) => acc && acc[curr], object);
}

export { makeRequest, getObjectValueFromPath };
