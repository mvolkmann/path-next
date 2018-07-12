# path-next

This is a set of functions that take an object and a path to a property in the object
and return a new object with a specific kind of change made at that path.

The original object is not modified.
Modified parts of the object tree are cloned.
Other parts are shared between old and new objects.

The functions provided are described below.

## deepFreeze

This freezes a given object and all objects inside it.
Attempts to modify any properties in this object,
no matter how deeply nested, will result in an error
in strict mode or be silently ignored in non-strict mode.
This is useful to catch attempts to modify objects
that should be immutable.

```js
deepFreeze(person);
```

## deletePath

This deletes the property at a given path within an object.

```js
deletePath(person, 'address.city');
```

## filterPath

This removes elements from an array found at a given path within an object.

```js
// Remove the color green if it exists.
const newPerson = filterPath(
  person,
  'favorites.colors',
  color => color !== 'green'
);
```

## getPath

This retrieves the value of a property at a given path.

```js
const colors = getPath(person, 'favorites.colors');
```

## mapPath

This modifies the values in an array at a given path.

```js
const newPerson = mapPath(person, 'favorite.colors', color =>
  color.toUpperCase()
);
```

## pushPath

This appends values to an array at a given path.

```js
// Add the colors yellow and orange the existing array of colors.
const newPerson = mapPath(person, 'favorite.colors', 'yellow', 'orange');
```

## setPath

This changes the value at a given path.

```js
const newPerson = setPath(person, 'address.city', 'New York');
```

## transformPath

This changes the value at a given path based on its current value.

```js
const newPerson = transformPath(person, 'age', age => age + 1);
```

## Path Concerns

If the layout of objects is expected to change over time
and the need to revisit hard-coded paths in these function calls
is a concern, consider using constants for the paths
so that only those values need to be changed.

For example, create the file `path-constants.js` containing:

```js
const export GAME_HIGH_SCORE = 'game.statistics.highScore';
const export USER_CITY = 'user.address.city';
```

Then in files that use these paths, do something like this:

```js
import {GAME_HIGH_SCORE, USER_CITY} from './path-constants';
setPath(user, USER_CITY, 'St. Louis');
transformPath(gameData, GAME_HIGH_SCORE, score => score + 1);
```

With this approach, if the paths change
it is only necessary to update these constants.
