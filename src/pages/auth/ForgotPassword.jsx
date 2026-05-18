import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, useToast, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const submit = async () => {
    const result = await authApi.forgotPassword(email);
    toast({ title: result.message, status: 'success' });
  };
  return (
    <Flex minH="100vh" bg="brand.cream" align="center" justify="center" p={6}>
      <Box maxW="480px" w="100%" bg="brand.card" borderRadius="18px" p={8}>
        <Heading size="lg">Reset Password</Heading>
        <Text mt={2} color="brand.muted">We will send a mock reset link.</Text>
        <VStack mt={6} spacing={4}>
          <FormControl isRequired><FormLabel>Email</FormLabel><Input value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl>
          <Button w="100%" bg="brand.navy" color="white" onClick={submit}>Send Reset Link</Button>
          <Link to="/login">Back to login</Link>
        </VStack>
      </Box>
    </Flex>
  );
}
