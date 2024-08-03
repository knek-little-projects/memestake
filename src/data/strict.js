export function mustBeOneOf(x, elements) {
  for (const el of elements) {
    if (el === x) {
      return el
    }
  }
  throw Error(`element ${x} must be one of ${elements}`)
}

export function defined(x, errorText) {
  if (x === undefined) {
    throw Error(`undefined value: ${errorText}`)
  }
  return x
}

export function nonnull(x, errorText) {
  if (x === null) {
    throw Error(`Unexpected null value: ${errorText}`)
  }
  return defined(x, errorText)
}

export function strict(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      const handler = {
        get(target, property) {
          if (!(property in target)) {
            if (property === "then") {
              // weird bug
            } else {
              throw new Error(`Property '${property}' does not exist on target object`);
            }
          }
          return target[property];
        }
      };

      const instance = new BaseClass(...args);
      return new Proxy(instance, handler);
    }
  }
}

export function assert(x, s) {
  if (!x) {
    console.error("" + s, ...[...arguments].slice(2))
    throw Error("" + s)
  }
}