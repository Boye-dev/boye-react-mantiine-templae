import Api from '@/api/Api';
import { LoginInterface, SignUpInterface } from '@/interfaces/auth.interface';
import { handleErrors } from '@/utils/handleErrors';

export const login = (values: LoginInterface) =>
  Api.post('/auth/login', values, {
    headers: {
      noBearerToken: true,
    },
  });

export const signUp = (values: SignUpInterface) =>
  Api.post('/user', values, {
    headers: {
      noBearerToken: true,
    },
  });

export const forgotPassword = ({ email }: { email: string }) =>
  Api.post(
    '/user/forgot-password',
    { email },
    {
      headers: {
        noBearerToken: true,
      },
    }
  );

export const resetPassword = ({
  password,
  token,
  id,
}: {
  password: string;
  token: string;
  id: string;
}) =>
  Api.patch(
    `/user/reset-password/${token}/${id}`,
    { password },
    {
      headers: {
        noBearerToken: true,
      },
    }
  );

export const verifyUser = async ({ token, id }: { token: string; id: string }) => {
  try {
    const res = await Api.get(`/user/verify/token/${token}/${id}`, {
      headers: {
        noBearerToken: true,
      },
    });
    if (res) {
      return res.data;
    }
  } catch (error) {
    return handleErrors(error);
  }
  return undefined;
};
