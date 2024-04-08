import { useEffect, useState } from 'react';
import axios from 'axios';
import Auth, { getDecodedJwt, getDecodedRefreshJwt } from '@/api/Auth';
import { templateBaseUrl } from '@/constants';
import { RolesEnum } from '@/constants/roles';

const useRoleAuthentication = (
  role: (keyof typeof RolesEnum)[]
): {
  loading: boolean;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const decodedToken = getDecodedJwt();
  const refreshJwt = async () => {
    const response = await axios.post(`${templateBaseUrl}/auth/refresh`, {
      refresh: Auth.getRefreshToken(),
    });
    Auth.setToken(response.data.accessToken);
    setAuthenticated(true);
    setLoading(false);
  };
  useEffect(() => {
    if (
      decodedToken &&
      decodedToken.id &&
      role.includes(decodedToken.role as keyof typeof RolesEnum)
    ) {
      const { exp } = decodedToken;

      if (exp) {
        if (exp * 1000 > Date.now()) {
          setLoading(false);
          setAuthenticated(true);
        } else {
          const decodedRefreshToken = getDecodedRefreshJwt();
          const { exp: refreshExpiry } = decodedRefreshToken;
          if (refreshExpiry) {
            if (refreshExpiry * 1000 > Date.now()) {
              try {
                refreshJwt();
              } catch (e) {
                Auth.removeToken();
                setLoading(false);
                setAuthenticated(false);
              }
            } else {
              Auth.removeToken();
              setLoading(false);
              setAuthenticated(false);
            }
          } else {
            setLoading(false);
            setAuthenticated(false);
          }
        }
      }
    } else {
      setLoading(false);
      setAuthenticated(false);
    }
  }, []);
  return { loading, authenticated, setAuthenticated };
};

export default useRoleAuthentication;
