import { Box, Button, Divider, Flex, Text, TextInput } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useDisclosure } from '@mantine/hooks';
import { forgotPassword } from '@/services/auth.service';
import AuthLayout from '@/components/Auth/AuthLayout';
import { handleErrors } from '@/utils/handleErrors';
import { AUTH_ROUTES } from '@/constants/routes';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [reset, { open }] = useDisclosure();
  const schema = z.object({
    email: z.string().email({ message: 'Invalid Email Address' }),
  });

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: zodResolver(schema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      notifications.show({
        title: 'Reset Passowrd Email Sent',
        message: 'Please check your email to reset password',
        color: 'green',
      });
      open();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const SuccessSignup = () => (
    <>
      <Flex w="100%" align="center" justify="center" direction="column" py={100}>
        <Box w="50px" h="50px" bg="gray" />

        <Text my={10} fw={700} fz={{ xs: 20, md: 30 }}>
          Link is on it&apos;s way
        </Text>
        <Text ta="center">
          Pellentesque pretium bibendum blandit. Nunc finibus faucibus sapien, in ultricies.
          Pellentesque pretium bibendum blandit. Nunc finibus faucibus sapien, in ultricies.
          Pellentesque pretium
        </Text>
        <Button my={20} size="md" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
          Login
        </Button>
      </Flex>
    </>
  );
  return (
    <>
      <AuthLayout>
        {reset ? (
          <SuccessSignup />
        ) : (
          <>
            <Text my={10} fw={700} fz={{ xs: 20, md: 30 }}>
              Forgot password
            </Text>
            <Text>Input the email associated with your account</Text>
            <form onSubmit={form.onSubmit((values) => mutate(values))}>
              <TextInput
                placeholder="Email address"
                my={20}
                size="md"
                {...form.getInputProps('email')}
              />

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
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
