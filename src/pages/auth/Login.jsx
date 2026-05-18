import React from 'react';
import { Box, Button, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const demoLogin = async (role) => {
    const user = await login(role);
    navigate(location.state?.from || `/${user.role}/dashboard`, { replace: true });
  };
  return (
    <Flex minH="100vh" bg="brand.cream" align="center" justify="center" p={6}>
      <Box maxW="820px" w="100%" bg="brand.card" border="1px solid rgba(169,119,33,.18)" borderRadius="20px" p={8} boxShadow="0 18px 44px rgba(17,24,39,.09)">
        <Text fontSize="54px" className="gold-text">♜</Text>
        <Heading>Chess by Panchatantra</Heading>
        <Text mt={2} color="brand.muted">Choose a demo role to enter the academy workspace.</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={8}>
          {['student', 'coach', 'admin'].map((role) => (
            <Button key={role} h="120px" bg="brand.navy" color="white" onClick={() => demoLogin(role)} _hover={{ bg: 'brand.goldDark' }}>
              Login as {role[0].toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </SimpleGrid>
        <VStack mt={6} spacing={1}>
          <Link to="/register">Create a demo account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </VStack>
      </Box>
    </Flex>
  );
}
