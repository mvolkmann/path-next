const PATH_DELIMITER = '.';
const fnArgs = [
  (name, arg) => {
    if (typeof arg !== 'object') {
      throw new Error(`${name} first argument must be an object`);
    }
  },
  (name, arg) => {
    if (typeof arg !== 'string') {
      throw new Error(`${name} second argument must be a path string`);
    }
  },
  (name, arg) => {
    if (typeof arg !== 'function') {
      throw new Error(`${name} third argument must be a function`);
    }
  },
];

function checkArgs(name, ...args) {
  args.forEach((arg, i) => fnArgs[i](name, arg));
}

function mutatePath(oldObj, path, fn) {
  const parts = path.split(PATH_DELIMITER);
  const lastPart = parts.pop();
  const newObj = {...oldObj};

  let obj = newObj;
  for (const part of parts) {
    const v = obj[part];
    const newV = {...v};
    obj[part] = newV;
    obj = newV;
  }
  fn(obj, lastPart);
  return newObj;
}

export function deepFreeze(obj, freezing = []) {
  checkArgs('deepFreeze', obj);
  if (Object.isFrozen(obj) || freezing.includes(obj)) return;

  freezing.push(obj);

  const props = Object.getOwnPropertyNames(obj);
  for (const prop of props) {
    const value = obj[prop];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value, freezing);
    }
  }

  Object.freeze(obj);
}

export function deletePath(oldObj, path) {
  checkArgs('deletePath', oldObj, path);
  return mutatePath(oldObj, path, (obj, lastPart) => delete obj[lastPart]);
}

export function filterPath(oldObj, path, filterFn) {
  checkArgs('filterPath', oldObj, path, filterFn);
  return mutatePath(oldObj, path, (obj, lastPart) => {
    const currentValue = obj[lastPart];
    if (!Array.isArray(currentValue)) {
      throw new Error(`filterPath can only be used on arrays and ${path} is not`);
    }
    obj[lastPart] = currentValue.filter(filterFn);
  });
}

export function getPath(obj, path) {
  checkArgs('getPath', obj, path);

  if (!path) return undefined;

  let value = obj;
  const parts = path.split(PATH_DELIMITER);
  for (const part of parts) {
    value = value[part];
    if (value === undefined) return value;
  }
  return value;
}

export function mapPath(oldObj, path, mapFn) {
  checkArgs('mapPath', oldObj, path, mapFn);
  return mutatePath(oldObj, path, (obj, lastPart) => {
    const currentValue = obj[lastPart];
    if (!Array.isArray(currentValue)) {
      throw new Error(`mapPath can only be used on arrays and ${path} is not`);
    }
    obj[lastPart] = currentValue.map(mapFn);
  });
}

export function pushPath(oldObj, path, ...values) {
  checkArgs('pushPath', oldObj, path);
  return mutatePath(oldObj, path, (obj, lastPart) => {
    const currentValue = obj[lastPart];
    if (!Array.isArray(currentValue)) {
      throw new Error(`pushPath can only be used on arrays and ${path} is not`);
    }
    obj[lastPart] = [...currentValue, ...values];
  });
}

export function setPath(oldObj, path, value) {
  checkArgs('setPath', oldObj, path);
  return mutatePath(oldObj, path, (obj, lastPart) => obj[lastPart] = value);
}

export function transformPath(oldObj, path, transformFn) {
  checkArgs('transformPath', oldObj, path, transformFn);
  return mutatePath(oldObj, path, (obj, lastPart) => {
    obj[lastPart] = transformFn(obj[lastPart]);
  });
}
