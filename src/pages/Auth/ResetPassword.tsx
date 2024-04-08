import { Box, Button, Flex, PasswordInput, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { zodResolver, useForm } from '@mantine/form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { handleErrors } from '@/utils/handleErrors';
import { resetPassword } from '@/services/auth.service';

import { AUTH_ROUTES } from '@/constants/routes';

const ResetPassword = () => {
  const [reset, { open }] = useDisclosure();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const schema = z
    .object({
      newPassword: z.string().min(8, { message: 'Password must be greater than 7 characters' }),
      confirmNewPassword: z
        .string()
        .min(8, { message: 'Password must be greater than 7 characters' }),
    })
    .refine((val) => val.newPassword === val.confirmNewPassword, {
      path: ['confirmNewPassword'],
      message: 'Password must be the same',
    });

  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },

    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      notifications.show({
        title: 'Password Reset Successfull',
        message: 'Your password has been reset successfull',
        color: 'green',
      });
      form.reset();
      open();
    },
    onError: (error) => {
      handleErrors(error, 'Error Resetting Password');
    },
  });
  const editPassword = (values: Record<string, any>) => {
    mutate({ password: values.newPassword, token, id });
  };
  const SuccessReset = () => (
    <>
      <Flex w="100%" align="center" justify="center" direction="column" py={100}>
        <Box w="50px" h="50px" bg="gray" />

        <Text my={10} fw={700} fz={{ xs: 20, md: 30 }} ta="center">
          You have successfully reset your password
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
      {reset ? (
        <SuccessReset />
      ) : (
        <form onSubmit={form.onSubmit((values) => editPassword(values))}>
          <Text my={10} fw={700} fz={{ xs: 20, md: 30 }}>
            Reset your password
          </Text>

          <PasswordInput
            placeholder="New Password"
            my={20}
            size="md"
            {...form.getInputProps('newPassword')}
          />
          <PasswordInput
            placeholder="Confirm New Password"
            size="md"
            {...form.getInputProps('confirmNewPassword')}
          />

          <Button fullWidth my={20} size="md" type="submit" loading={isPending}>
            Reset
          </Button>
        </form>
      )}
    </>
  );
};

export default ResetPassword;
