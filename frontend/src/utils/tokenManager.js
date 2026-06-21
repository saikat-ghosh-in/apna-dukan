const USER_KEY = 'user';

export const getUserData = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }
};

export const setGuestToken = (guestToken) => {
  if (!guestToken) return;

  const userData = getUserData() || {};
  userData.guestToken = guestToken;
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getActiveToken = () => {
  const userData = getUserData();
  if (!userData) return null;

  if (userData.token && !isTokenExpired(userData.tokenExpirationTime)) {
    return userData.token;
  }

  return userData.guestToken || null;
};

export const clearUserToken = () => {
  const userData = getUserData();
  if (!userData) return;

  const guestOnly = {
    guestToken: userData.guestToken
  };

  localStorage.setItem(USER_KEY, JSON.stringify(guestOnly));
};

export const clearAllTokens = () => {
  localStorage.removeItem(USER_KEY);
};

export const isTokenExpired = (tokenExpirationTime) => {
  if (!tokenExpirationTime) return true;
  return Date.now() >= tokenExpirationTime;
};

export const getTokenTimeRemaining = (tokenExpirationTime) => {
  if (!tokenExpirationTime) return 0;
  return Math.max(0, tokenExpirationTime - Date.now());
};

export const isAuthenticated = () => {
  const userData = getUserData();
  return userData?.token && !isTokenExpired(userData.tokenExpirationTime);
};