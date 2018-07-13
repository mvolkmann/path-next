const PATH_DELIMITER = '.';

export function deepFreeze(obj, freezing = []) {
  if (typeof obj !== 'object') {
    throw new Error('deepFreeze first argument must be an object');
  }

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
  if (typeof oldObj !== 'object') {
    throw new Error('deletePath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('deletePath second argument must be a path string');
  }

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

  delete obj[lastPart];

  return newObj;
}

export function filterPath(oldObj, path, filterFn) {
  if (typeof oldObj !== 'object') {
    throw new Error('filterPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('filterPath second argument must be a path string');
  }

  if (typeof filterFn !== 'function') {
    throw new Error('filterPath third argument must be a function');
  }

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

  const currentValue = obj[lastPart];
  if (!Array.isArray(currentValue)) {
    throw new Error(`filterPath can only be used on arrays and ${path} is not`);
  }

  obj[lastPart] = currentValue.filter(filterFn);

  return newObj;
}

export function getPath(obj, path) {
  if (typeof obj !== 'object') {
    throw new Error('getPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('getPath second argument must be a path string');
  }

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
  if (typeof oldObj !== 'object') {
    throw new Error('mapPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('mapPath second argument must be a path string');
  }

  if (typeof mapFn !== 'function') {
    throw new Error('mapPath third argument must be a function');
  }

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

  const currentValue = obj[lastPart];
  if (!Array.isArray(currentValue)) {
    throw new Error(`mapPath can only be used on arrays and ${path} is not`);
  }

  obj[lastPart] = currentValue.map(mapFn);

  return newObj;
}

export function pushPath(oldObj, path, ...values) {
  if (typeof oldObj !== 'object') {
    throw new Error('pushPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('pushPath second argument must be a path string');
  }

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

  const currentValue = obj[lastPart];
  if (!Array.isArray(currentValue)) {
    throw new Error(`pushPath can only be used on arrays and ${path} is not`);
  }

  obj[lastPart] = [...currentValue, ...values];

  return newObj;
}

export function setPath(oldObj, path, value) {
  if (typeof oldObj !== 'object') {
    throw new Error('setPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('setPath second argument must be a path string');
  }

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

  obj[lastPart] = value;

  return newObj;
}

export function transformPath(oldObj, path, transformFn) {
  if (typeof oldObj !== 'object') {
    throw new Error('transformPath first argument must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('transformPath second argument must be a path string');
  }

  if (typeof transformFn !== 'function') {
    throw new Error('transformPath third argument must be a function');
  }

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

  const currentValue = obj[lastPart];
  obj[lastPart] = transformFn(currentValue);

  return newObj;
}
