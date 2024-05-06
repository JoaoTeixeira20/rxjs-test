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

function traverseObject(
  obj: any,
  path?: string
): {
  origin: string;
  destination: string;
  destinationPath: string;
  originParh: string;
}[] {
  const result: {
    origin: string;
    destination: string;
    destinationPath: string;
    originParh: string;
  }[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item: unknown, index: number) => {
          if (typeof item === "object") {
            result.push(
              ...traverseObject(
                item,
                `${path ? `${path}.` : ``}${key}.${index}`
              )
            );
          } else if (typeof item === "string") {
            if (String(item).startsWith("$")) {
              const extractedPath = item.replace(/\$|{|}/g, "").split(".");
              const extractedOriginPath = `${
                path ? `${path}.` : ``
              }${key}`.split(".");
              result.push({
                origin: extractedPath[0],
                originParh: extractedPath.slice(1).join("."),
                destination: extractedOriginPath[0],
                destinationPath: extractedOriginPath.slice(1).join("."),
              });
            }
          }
        });
      } else if (typeof value === "object") {
        result.push(
          ...traverseObject(value, `${path ? `${path}.` : ``}${key}`)
        );
      } else if (typeof value === "string") {
        if (value.startsWith("$")) {
          const extractedPath = value.replace(/\$|{|}/g, "").split(".");
          const destinationPath = `${path ? `${path}.` : ``}${key}`.split(".");
          result.push({
            origin: extractedPath[0],
            originParh: extractedPath.slice(1).join("."),
            destination: destinationPath[0],
            destinationPath: destinationPath.slice(1).join("."),
          });
        }
      }
    }
  }

  return result;
}

export { makeRequest, traverseObject };
