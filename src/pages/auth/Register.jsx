import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, VStack } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const [values, setValues] = useState({ name: '', email: '', role: 'student' });
  const { register } = useAuth();
  const navigate = useNavigate();
  const submit = async () => {
    const user = await register(values);
    navigate(`/${user.role}/dashboard`);
  };
  return (
    <Flex minH="100vh" bg="brand.cream" align="center" justify="center" p={6}>
      <Box maxW="520px" w="100%" bg="brand.card" borderRadius="18px" p={8}>
        <Heading size="lg">Register</Heading>
        <VStack mt={6} spacing={4}>
          <FormControl isRequired><FormLabel>Name</FormLabel><Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></FormControl>
          <FormControl isRequired><FormLabel>Email</FormLabel><Input value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></FormControl>
          <FormControl><FormLabel>Role</FormLabel><Select value={values.role} onChange={(e) => setValues({ ...values, role: e.target.value })}><option value="student">Student</option><option value="coach">Coach</option><option value="admin">Admin</option></Select></FormControl>
          <Button w="100%" bg="brand.navy" color="white" onClick={submit}>Create Account</Button>
          <Link to="/login">Back to login</Link>
        </VStack>
      </Box>
    </Flex>
  );
}
