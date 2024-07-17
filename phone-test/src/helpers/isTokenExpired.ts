// Base64 URL decode function
const base64UrlDecode = (str: string) => {
  try {
    return JSON.parse(
      decodeURIComponent(
        atob(str)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      )
    );
  } catch (error) {
    throw new Error('Failed to decode base64 string');
  }
};

// Function to check if a JWT token has expired: true means it is expired
export const isTokenExpired = (token: string | null) => {
  if (!token) {
    return true; // Consider token expired if it's not present
  }

  const [, payload] = token.split('.');
  if (!payload) {
    throw new Error('Invalid token');
  }

  const decodedPayload = base64UrlDecode(payload);
  if (!decodedPayload.exp) {
    throw new Error('Token does not contain expiration date');
  }

  const { exp } = decodedPayload;

  const now = Date.now() / 1000;

  const isExpired = now >= exp;

  return isExpired;
};
