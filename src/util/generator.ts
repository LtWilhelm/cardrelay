export function* naturalsUntil(x: number) {
  for (let i = 0; i < x; i++) {
    yield i;
  }
}
