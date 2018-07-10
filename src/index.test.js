import {
  deepFreeze,
  deletePath,
  filterPath,
  getPathValue,
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

  test('deletePath', () => {
    const path = 'bar.baz';
    const newObj = deletePath(oldObj, path);
    const actual = getPathValue(newObj, path);
    expect(actual).toBeUndefined();
  });

  test('filterPath', () => {
    const path = 'bar.qux';

    // Remove all elements that contain the letter "t".
    const filterFn = element => !/t/.test(element);
    const newObj = filterPath(oldObj, path, filterFn);

    const actual = getPathValue(newObj, path);
    expect(actual).toEqual(['one']);
  });

  test('filterPath passing non-function', () => {
    const filterFn = 'This is not a function.';
    const msg = 'filterPath must be passed a function';
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
    let actual = getPathValue(oldObj, path);
    expect(actual).toBeUndefined();

    path = 'top';
    let value = 7;
    let newObj = setPath(oldObj, path, value);
    actual = getPathValue(newObj, 'top');
    expect(actual).toBe(7);

    path = 'foo.bar.baz';
    value = 'some value';
    newObj = setPath(oldObj, path, value);
    actual = getPathValue(newObj, path);
    expect(actual).toBe(value);
  });

  test('getPathValue with no path', () => {
    const path = undefined;
    expect(getPathValue(oldObj, path)).toBeUndefined();
  });

  //TODO: This passes when run by itself!
  test('mapPath', () => {
    const path = 'bar.qux';

    // Uppercase all elements.
    const mapFn = element => element.toUpperCase();
    const newObj = mapPath(oldObj, path, mapFn);

    const actual = getPathValue(newObj, path);
    expect(actual).toEqual(['ONE', 'TWO', 'THREE']);
  });

  test('mapPath passing non-function', () => {
    const filterFn = 'This is not a function.';
    const msg = 'mapPath must be passed a function';
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

    const actual = getPathValue(newObj, path);
    expect(actual).toEqual(['one', 'two', 'three', 'four', 'five']);
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
    const actual = getPathValue(newObj, path);
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

  test('transformPath', () => {
    const path = 'bar.baz';
    const initialValue = getPathValue(oldObj, path);
    const newObj = transformPath(oldObj, path, v => v + 1);
    const newValue = getPathValue(newObj, path);
    expect(newValue).toEqual(initialValue + 1);
  });

  test('transformPath passing non-function', () => {
    const filterFn = 'This is not a function.';
    const msg = 'transformPath must be passed a function';
    expect(() => transformPath(oldObj, 'some.path', filterFn)).toThrow(
      new Error(msg)
    );
  });
});
