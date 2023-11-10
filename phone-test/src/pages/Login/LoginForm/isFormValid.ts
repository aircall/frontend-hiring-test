export function isFormValid(email: string | undefined, password: string | undefined) {
  if (!email || !password) {
    return false;
  }

  return true;
}
