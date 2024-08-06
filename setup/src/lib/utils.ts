/**
 * Generate a random string of the given length.
 * @param length The length of the random string to generate.
 * @author Mathew C <https://sentry.io/answers/generate-random-string-characters-in-javascript/>
 */
export function createRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  randomArray.forEach((number) => {
    result += chars[number % chars.length];
  });
  return result;
}
