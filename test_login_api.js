// Test script for login API
// Credentials should be passed through environment variables
const axios = require('axios');

async function testLogin() {
  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Please provide TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email,
      password
    });
    console.log('Success:', response.status, response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error:', error.response.status, error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// testLogin();
