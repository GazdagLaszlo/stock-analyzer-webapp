import api from '../api/api';
import { tokenKeyName } from '../constants/constants';

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await api.User.apiUserRefreshTokenPost({
      withCredentials: true,
    });
    const newToken = res.data.accessToken!;

    localStorage.setItem(tokenKeyName, newToken);

    return newToken;
  } catch (err) {
    console.error('Refresh token failed', err);
    localStorage.removeItem(tokenKeyName);
    return null;
  }
};

//Itt frissiteni kellene a role... tagokat is
