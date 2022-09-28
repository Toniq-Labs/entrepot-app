export function resolvedOrUndefined(input) {
  if (input instanceof Promise) {
    return undefined;
  } else {
    return input;
  }
}
