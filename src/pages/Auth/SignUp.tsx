import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  NumberInput,
  PasswordInput,
  Select,
  Tabs,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
import { ServicesEnum, SignUpInterface } from '@/interfaces/auth.interface';
import { signUp } from '@/services/auth.service';
import { handleErrors } from '@/utils/handleErrors';

import { AUTH_ROUTES } from '@/constants/routes';
import { convertAllUpperCaseToSentenceCase } from '@/utils/textHelpers';
import { RolesEnum } from '@/constants/roles';

const SignUp = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const schema = z
    .object({
      email: z.string().email({ message: 'Invalid Email Address' }),
      password: z.string().min(8, 'Password must be greater than 8'),
      confirmPassword: z.string().min(8, 'Password must be greater than 8'),
      service: z.string().nullable(),
      role: z.string(),
    })
    .refine(
      (data) => {
        if (data.role === 'CUSTOMER') {
          return !data.service;
        }
        return true;
      },
      {
        message: 'Service is required for service provider',
        path: ['service'],
      }
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  const form = useForm<SignUpInterface>({
    initialValues: {
      email: '',
      password: '',
      phoneNumber: '',
      service: null,
      role: 'SERVICE_PROVIDER_INDIVIDUAL',
      confirmPassword: '',
    },
    validate: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      notifications.show({
        title: 'Sign Up successful',
        message: 'Check your email for verification link',
        color: 'green',
      });
      toggle();
    },
    onError: (error) => {
      handleErrors(error);
    },
  });
  const submitSignup = (values: SignUpInterface) => {
    const payload = {
      ...values,
      phoneNumber: `+234${values.phoneNumber}`,
    };
    if (values.role === RolesEnum.CUSTOMER) {
      delete payload.service;
    }
    mutate(payload);
  };

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
      <Box>
        {opened ? (
          <SuccessSignup />
        ) : (
          <>
            <Text my={10} fw={700} fz={{ xs: 20, md: 30 }}>
              Create a MVP Account
            </Text>
            <Text> Try out our website for an unforgettable experience</Text>
            <Tabs
              mt={10}
              defaultValue="individual"
              onChange={(value) => {
                form.clearErrors();
                if (value === 'individual') {
                  form.setFieldValue('role', RolesEnum.SERVICE_PROVIDER_INDIVIDUAL);
                }
                if (value === 'company') {
                  form.setFieldValue('role', RolesEnum.SERVICE_PROVIDER_COMPANY);
                }
                if (value === 'customer') {
                  form.setFieldValue('role', RolesEnum.CUSTOMER);
                  form.setFieldValue('service', null);
                }
              }}
            >
              <Tabs.List>
                <Tabs.Tab value="individual" w="33%" disabled={isPending}>
                  Artisan
                </Tabs.Tab>
                <Tabs.Tab value="company" w="33%" disabled={isPending}>
                  Company
                </Tabs.Tab>
                <Tabs.Tab value="customer" w="33%" disabled={isPending}>
                  Customer
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <form onSubmit={form.onSubmit((values) => submitSignup(values))}>
              <TextInput
                placeholder="Email address"
                my={20}
                size="md"
                {...form.getInputProps('email')}
              />

              <NumberInput
                maxLength={12}
                minLength={12}
                size="md"
                placeholder="Phone Number"
                thousandSeparator=" "
                hideControls
                leftSection={
                  <Flex align="center" justify="space-around" h="100%" p={10}>
                    <Box bg="gray" w="15px" h="15px" style={{ borderRadius: '100%' }} />
                    <Text mx={15}>+234</Text>
                    <Divider orientation="vertical" />
                  </Flex>
                }
                leftSectionWidth={rem(100)}
                {...form.getInputProps('phoneNumber')}
              />
              {form.values.role !== 'CUSTOMER' && (
                <Select
                  placeholder="Service"
                  data={Object.keys(ServicesEnum).map((item) => ({
                    label: convertAllUpperCaseToSentenceCase(item),
                    value: item,
                  }))}
                  size="md"
                  my={20}
                  {...form.getInputProps('service')}
                />
              )}
              <PasswordInput
                placeholder="Password"
                size="md"
                my={20}
                {...form.getInputProps('password')}
              />
              <Text>
                Password must contain UPPERCASE letter, an alphabet, a number and a symbol
              </Text>
              <PasswordInput
                placeholder="Confirm Password"
                size="md"
                mt={20}
                {...form.getInputProps('confirmPassword')}
              />

              <Button fullWidth my={20} size="md" type="submit" loading={isPending}>
                Continue
              </Button>
            </form>
            {/* <IndividualComponent /> */}
            <Flex justify="center" align="center" my={50}>
              <Anchor ta="center" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                Already have a MVP account? Log in
              </Anchor>
              <IconChevronRight />
            </Flex>
          </>
        )}
      </Box>
    </>
  );
};

export default SignUp;
