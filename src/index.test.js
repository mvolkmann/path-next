import {
  deepFreeze,
  deletePath,
  filterPath,
  getPath,
  mapPath,
  pushPath,
  setPath,
  transformPath
} from './index';

const TEST_OBJECT = {
  foo: 1,
  bar: {
    baz: 2,
    qux: ['one', 'two', 'three']
  }
};

describe('path-next', () => {
  let oldObj;

  // Mocks sessionStorage.
  beforeEach(() => {
    oldObj = TEST_OBJECT;
  });

  test('deepFreeze simple', () => {
    const obj = {foo: 1, bar: true};
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
  });

  test('deepFreeze nested', () => {
    const obj = {foo: 1, bar: {baz: true}};
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(obj.bar)).toBe(true);
  });

  test('deepFreeze cyclic', () => {
    const obj = {foo: 1};
    obj.bar = obj;
    deepFreeze(obj);
    expect(Object.isFrozen(obj)).toBe(true);
    expect(Object.isFrozen(obj.bar)).toBe(true);
  });

  test('deepFreeze bad first argument', () => {
    const msg = 'deepFreeze first argument must be an object';
    expect(() => deepFreeze('bad')).toThrow(new Error(msg));
  });

  test('deletePath', () => {
    const path = 'bar.baz';
    const newObj = deletePath(oldObj, path);
    const actual = getPath(newObj, path);
    expect(actual).toBeUndefined();
  });

  test('deletePath bad first argument', () => {
    const msg = 'deletePath first argument must be an object';
    expect(() => deletePath(false)).toThrow(new Error(msg));
  });

  test('deletePath bad second argument', () => {
    const msg = 'deletePath second argument must be a path string';
    expect(() => deletePath({}, false)).toThrow(new Error(msg));
  });

  test('filterPath', () => {
    const path = 'bar.qux';

    // Remove all elements that contain the letter "t".
    const filterFn = element => !/t/.test(element);
    const newObj = filterPath(oldObj, path, filterFn);

    const actual = getPath(newObj, path);
    expect(actual).toEqual(['one']);
  });

  test('filterPath bad first argument', () => {
    const msg = 'filterPath first argument must be an object';
    expect(() => filterPath(false)).toThrow(new Error(msg));
  });

  test('filterPath bad second argument', () => {
    const msg = 'filterPath second argument must be a path string';
    expect(() => filterPath({}, false)).toThrow(new Error(msg));
  });

  test('filterPath bad third argument', () => {
    const filterFn = 'This is not a function.';
    const msg = 'filterPath third argument must be a function';
    expect(() => filterPath(oldObj, 'some.path', filterFn)).toThrow(
      new Error(msg)
    );
  });

  test('filterPath with path to non-array', () => {
    const path = 'bar.baz';
    const filterFn = value => value;
    const msg = `filterPath can only be used on arrays and ${path} is not`;
    expect(() => filterPath(oldObj, path, filterFn)).toThrow(new Error(msg));
  });

  test('getPathValue', () => {
    let path = 'nothing.found.here';
    let actual = getPath(oldObj, path);
    expect(actual).toBeUndefined();

    path = 'top';
    let value = 7;
    let newObj = setPath(oldObj, path, value);
    actual = getPath(newObj, 'top');
    expect(actual).toBe(7);

    path = 'foo.bar.baz';
    value = 'some value';
    newObj = setPath(oldObj, path, value);
    actual = getPath(newObj, path);
    expect(actual).toBe(value);
  });

  test('getPathValue bad first argument', () => {
    const msg = 'getPathValue first argument must be an object';
    expect(() => getPath(false)).toThrow(new Error(msg));
  });

  test('getPathValue bad second argument', () => {
    const msg = 'getPathValue second argument must be a path string';
    expect(() => getPath({}, false)).toThrow(new Error(msg));
  });

  test('getPathValue with empty path', () => {
    expect(getPath({}, '')).toBeUndefined();
  });

  //TODO: This passes when run by itself!
  test('mapPath', () => {
    const path = 'bar.qux';

    // Uppercase all elements.
    const mapFn = element => element.toUpperCase();
    const newObj = mapPath(oldObj, path, mapFn);

    const actual = getPath(newObj, path);
    expect(actual).toEqual(['ONE', 'TWO', 'THREE']);
  });

  test('mapPath bad first argument', () => {
    const msg = 'mapPath first argument must be an object';
    expect(() => mapPath(false)).toThrow(new Error(msg));
  });

  test('mapPath bad second argument', () => {
    const msg = 'mapPath second argument must be a path string';
    expect(() => mapPath({}, false)).toThrow(new Error(msg));
  });

  test('mapPath bad third argument', () => {
    const filterFn = 'This is not a function.';
    const msg = 'mapPath third argument must be a function';
    expect(() => mapPath(oldObj, 'some.path', filterFn)).toThrow(
      new Error(msg)
    );
  });

  test('mapPath with path to non-array', () => {
    const path = 'bar.baz';
    const filterFn = value => value;
    const msg = `mapPath can only be used on arrays and ${path} is not`;
    expect(() => mapPath(oldObj, path, filterFn)).toThrow(new Error(msg));
  });

  test('pushPath', () => {
    const path = 'bar.qux';

    // remove all elements that contain the letter "t".
    const newObj = pushPath(oldObj, path, 'four', 'five');

    const actual = getPath(newObj, path);
    expect(actual).toEqual(['one', 'two', 'three', 'four', 'five']);
  });

  test('pushPath bad first argument', () => {
    const msg = 'pushPath first argument must be an object';
    expect(() => pushPath(false)).toThrow(new Error(msg));
  });

  test('pushPath bad second argument', () => {
    const msg = 'pushPath second argument must be a path string';
    expect(() => pushPath({}, false)).toThrow(new Error(msg));
  });

  test('pushPath with path to non-array', () => {
    const path = 'bar.baz';
    const msg = `pushPath can only be used on arrays and ${path} is not`;
    expect(() => pushPath(oldObj, path, 'v1', 'v2')).toThrow(new Error(msg));
  });

  test('setPath', () => {
    // Using mock store so we can retrieve actions.
    //reduxSetup({initialState, mock: true, silent: true});
    const path = 'some.deep.path';
    const value = 'some value';
    const newObj = setPath(oldObj, path, value);
    const actual = getPath(newObj, path);
    expect(actual).toBe(value);
  });

  test('setPath', () => {
    const oldObj = {
      foo: {
        bar: {
          baz: 1,
          c3: 3
        },
        c2: 2
      },
      c1: 1
    };
    const path = 'foo.bar.baz';
    const value = 2;
    const newObj = setPath(oldObj, path, value);
    expect(newObj.c1).toBe(1);
    expect(newObj.foo.c2).toBe(2);
    expect(newObj.foo.bar.c3).toBe(3);
    expect(newObj.foo.bar.baz).toBe(value);
  });

  test('setPath bad first argument', () => {
    const msg = 'setPath first argument must be an object';
    expect(() => setPath(false)).toThrow(new Error(msg));
  });

  test('setPath bad second argument', () => {
    const msg = 'setPath second argument must be a path string';
    expect(() => setPath({}, false)).toThrow(new Error(msg));
  });

  test('transformPath', () => {
    const path = 'bar.baz';
    const initialValue = getPath(oldObj, path);
    const newObj = transformPath(oldObj, path, v => v + 1);
    const newValue = getPath(newObj, path);
    expect(newValue).toEqual(initialValue + 1);
  });

  test('transformPath bad first argument', () => {
    const msg = 'transformPath first argument must be an object';
    expect(() => transformPath(false)).toThrow(new Error(msg));
  });

  test('transformPath bad second argument', () => {
    const msg = 'transformPath second argument must be a path string';
    expect(() => transformPath({}, false)).toThrow(new Error(msg));
  });

  test('transformPath bad third argument', () => {
    const filterFn = 'This is not a function.';
    const msg = 'transformPath third argument must be a function';
    expect(() => transformPath(oldObj, 'some.path', filterFn)).toThrow(
      new Error(msg)
    );
  });
});
