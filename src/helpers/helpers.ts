import { TSubscribedTemplates } from '@/types/templateTypes';
import { OutgoingHttpHeaders } from 'http2';

function makeRequest(
  method: string,
  url: string,
  headers?: OutgoingHttpHeaders
) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (headers) {
      Object.keys(headers).forEach((header) => {
        xhr.setRequestHeader(
          header,
          headers[header as keyof OutgoingHttpHeaders] as string
        );
      });
    }
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

function extractFieldKeys(expression: string) {
  const regex = /\${(.*?)}/g;
  const extractedValues = [];
  let match;
  while ((match = regex.exec(expression)) !== null) {
    extractedValues.push(match[1]);
  }
  return extractedValues.map((el) => el.split('.')[0]);
}

function traverseObject(obj: any, path?: string): TSubscribedTemplates[] {
  const result: TSubscribedTemplates[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item: unknown, index: number) => {
          if (typeof item === 'object') {
            result.push(
              ...traverseObject(
                item,
                `${path ? `${path}.` : ``}${key}.${index}`
              )
            );
          } else if (typeof item === 'string') {
            if (String(item).includes('$')) {
              // const extractedPath = item.replace(/\$|{|}/g, '').split('.');
              const extractedOriginPath = `${
                path ? `${path}.` : ``
              }${key}`.split('.');
              result.push({
                originExpression: item,
                originFieldKeys: extractFieldKeys(item),
                destinationKey: extractedOriginPath[0],
                destinationProperty: extractedOriginPath[1],
                destinationPath: extractedOriginPath.slice(2),
              });
            }
          }
        });
      } else if (typeof value === 'object') {
        result.push(
          ...traverseObject(value, `${path ? `${path}.` : ``}${key}`)
        );
      } else if (typeof value === 'string') {
        if (value.includes('$')) {
          // const extractedPath = value.replace(/\$|{|}/g, '').split('.');
          const destinationPath = `${path ? `${path}.` : ``}${key}`.split('.');
          result.push({
            originExpression: value,
            originFieldKeys: extractFieldKeys(value),
            destinationKey: destinationPath[0],
            destinationProperty: destinationPath[1],
            destinationPath: destinationPath.slice(2),
          });
        }
      }
    }
  }

  return result;
}

export { makeRequest, traverseObject, extractFieldKeys };
