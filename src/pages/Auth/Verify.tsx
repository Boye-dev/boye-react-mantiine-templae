import { Anchor, Box, Center, Container, Flex, Loader, Paper, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUTH_ROUTES } from '@/constants/routes';
import { verifyUser } from '@/services/auth.service';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const navigate = useNavigate();
  const { isFetching, isError } = useQuery({
    queryKey: ['verify-user'],
    queryFn: () => verifyUser({ token, id }),
  });
  return (
    <>
      <Container h={{ xs: 'auto', md: '100vh' }} size="lg">
        <Flex align="center" w="100%" h="100%">
          <Paper shadow="md" w="100%">
            <Box w="100%" p={{ xs: 20, md: 50 }}>
              <Flex justify="center" align="center">
                {isFetching ? (
                  <Text ta="center">We are setting up your account</Text>
                ) : isError ? (
                  <Anchor ta="center" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                    Error setting up your account. Login?
                  </Anchor>
                ) : (
                  <Anchor ta="center" onClick={() => navigate(AUTH_ROUTES.LOGIN)}>
                    Account setup complete Login?
                  </Anchor>
                )}
                {isFetching && <Loader size="xs" ml={10} />}
              </Flex>

              {!isError && (
                <Text ta="center" my={20} fw={700} fz={{ xs: 20, md: 30 }}>
                  Welcome to the platform that connects you with the best services
                </Text>
              )}
              <Flex justify="center" align="end" h="auto" mt={80}>
                <Box pos="relative" w="90%">
                  <Box bg="gray" w="50%" h="390px">
                    12
                  </Box>
                  <Box
                    bg="#E9E9E9"
                    w="50%"
                    h="336px"
                    pos="absolute"
                    top="-12%"
                    right="5%"
                    style={{ borderRadius: '10px' }}
                  >
                    Chat
                  </Box>
                </Box>
                <Center inline>
                  <Box bg="gray" w="20px" h="20px" style={{ borderRadius: '100%' }} />
                  <Text>LOGO</Text>
                </Center>
              </Flex>
            </Box>
          </Paper>
        </Flex>
      </Container>
    </>
  );
};

export default Verify;
