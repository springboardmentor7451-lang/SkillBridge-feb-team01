import axios from 'axios';

async function testApiLogin() {
    try {
        const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'ngo@skillbridge.org',
            password: 'password123'
        });
        console.log("Login SUCCESS!");
        console.log(res.data);
    } catch (err) {
        console.error("Login FAILED!");
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
    }
}

testApiLogin();
