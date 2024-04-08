import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ARTISAN_PAGES, AUTH_ROUTES, PUBLIC_PAPGES } from '@/constants/routes';
import { LoginInterface } from '@/interfaces/auth.interface';
import { login } from '@/services/auth.service';
import Auth, { IUserDecoded, getDecodedJwt } from '@/api/Auth';
import { handleErrors } from '@/utils/handleErrors';
import { RolesEnum } from '@/constants/roles';
import useRoleAuthentication from '@/hooks/useRoleAuthentication';

const Login = () => {
  const { loading, authenticated } = useRoleAuthentication([...Object.values(RolesEnum)]);
  const decodedUser: IUserDecoded = getDecodedJwt();

  const navigate = useNavigate();
  const schema = z.object({
    username: z.string().email({ message: 'Invalid Email Address' }),
    password: z.string().min(6, 'Password must be greater than 6'),
  });

  const form = useForm<LoginInterface>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (tokenData) => {
      notifications.show({
        title: 'Login successful',
        message: 'You have successfully loggged in',
        color: 'green',
      });

      Auth.setToken(tokenData?.data?.accessToken);
      Auth.setRefreshToken(tokenData?.data?.refreshToken);
      const decodedUserLogin: IUserDecoded = getDecodedJwt();

      if (decodedUserLogin.role === RolesEnum.CUSTOMER) {
        navigate(PUBLIC_PAPGES.HOME);
      }
      if (decodedUserLogin.role !== RolesEnum.CUSTOMER) {
        navigate(ARTISAN_PAGES.DASHBOARD);
      }
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const submitLogin = (values: LoginInterface) => {
    mutate(values);
  };
  useEffect(() => {
    if (!loading) {
      if (authenticated && decodedUser.role === RolesEnum.CUSTOMER) {
        navigate(-1);
      }
      if (authenticated && decodedUser.role !== RolesEnum.CUSTOMER) {
        navigate(ARTISAN_PAGES.DASHBOARD);
      }
    }
  }, [loading, authenticated]);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={2000}
          overlayProps={{ radius: 'xl', blur: 50 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />

        <Text my={10} fw={700} fz={{ xs: 20, md: 30 }}>
          Login to your MVP Account
        </Text>
        <Text> Try out our website for an unforgettable experience</Text>
        <form onSubmit={form.onSubmit((values) => submitLogin(values))}>
          <TextInput
            placeholder="Email address"
            my={20}
            size="md"
            {...form.getInputProps('username')}
          />
          <PasswordInput placeholder="Password" size="md" {...form.getInputProps('password')} />
          <Text ta="right" my={20} td="underline">
            <Anchor onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}>Forgot Password?</Anchor>
          </Text>
          <Button fullWidth my={20} size="md" type="submit" loading={isPending}>
            Continue
          </Button>
        </form>
        <Divider label="Or" labelPosition="center" size="sm" />

        <Flex
          justify="center"
          align="center"
          my={50}
          onClick={() => navigate(AUTH_ROUTES.SIGN_UP_ARTISAN)}
          style={{ cursor: 'pointer' }}
        >
          <Text ta="center">Don&apos;t have a MVP account yet? Sign up</Text>
          <IconChevronRight />
        </Flex>
      </Box>
    </>
  );
};

export default Login;
