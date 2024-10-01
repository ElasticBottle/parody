export function getErrorString(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}
