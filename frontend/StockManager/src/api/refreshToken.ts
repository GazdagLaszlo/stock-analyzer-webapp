import api from '../api/api';
import { tokenKeyName } from '../constants/constants';

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await api.User.apiUserRefreshTokenPost({
      withCredentials: true,
    });
    const newToken = res.data.accessToken!;

    sessionStorage.setItem(tokenKeyName, newToken);

    return newToken;
  } catch (err) {
    console.error('Refresh token failed', err);
    sessionStorage.removeItem(tokenKeyName);
    return null;
  }
};
