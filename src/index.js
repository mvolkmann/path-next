const getPathParts = path => path.split('.');

function mutatePath(oldObj, path, fn) {
  const parts = getPathParts(path);
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

function transform(oldObj, path, fn) {
  return mutatePath(oldObj, path, (obj, key) => (obj[key] = fn(obj[key])));
}

function validateArgs(name, ...args) {
  if (typeof args[0] !== 'object') {
    throw new Error(`${name} first argument must be an object`);
  }
  if (args.length >= 2 && typeof args[1] !== 'string') {
    throw new Error(`${name} second argument must be a path string`);
  }
  if (args.length >= 3 && typeof args[2] !== 'function') {
    throw new Error(`${name} third argument must be a function`);
  }
}

function validateArray(name, path, value) {
  if (!Array.isArray(value)) {
    throw new Error(`${name} can only be used on arrays and ${path} is not`);
  }
}

// The second argument should only be specified in recursive calls.
export function deepFreeze(obj, freezing = []) {
  validateArgs('deepFreeze', obj);
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
  validateArgs('deletePath', oldObj, path);
  return mutatePath(oldObj, path, (obj, lastPart) => delete obj[lastPart]);
}

export function filterPath(oldObj, path, filterFn) {
  validateArgs('filterPath', oldObj, path, filterFn);
  return transform(oldObj, path, currentValue => {
    validateArray('filterPath', path, currentValue);
    return currentValue.filter(filterFn);
  });
}

export function getPath(obj, path) {
  validateArgs('getPath', obj, path);
  if (!path) return undefined;

  let value = obj;
  const parts = getPathParts(path);
  for (const part of parts) {
    value = value[part];
    if (value === undefined) return value;
  }
  return value;
}

export function mapPath(oldObj, path, mapFn) {
  validateArgs('mapPath', oldObj, path, mapFn);
  return transform(oldObj, path, currentValue => {
    validateArray('mapPath', path, currentValue);
    return currentValue.map(mapFn);
  });
}

export function pushPath(oldObj, path, ...values) {
  validateArgs('pushPath', oldObj, path);
  return transform(oldObj, path, currentValue => {
    validateArray('pushPath', path, currentValue);
    return [...currentValue, ...values];
  });
}

export function setPath(oldObj, path, value) {
  validateArgs('setPath', oldObj, path);
  return transform(oldObj, path, () => value);
}

export function transformPath(oldObj, path, transformFn) {
  validateArgs('transformPath', oldObj, path, transformFn);
  return transform(oldObj, path, transformFn);
}
