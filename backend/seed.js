const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const users = [
            {
                name: 'Volunteer User',
                email: 'volunteer@example.com',
                password: hashedPassword,
                role: 'volunteer',
                skills: ['JavaScript', 'Python'],
                location: 'New York',
                bio: 'I love helping people.'
            },
            {
                name: 'NGO User',
                email: 'ngo@example.com',
                password: hashedPassword,
                role: 'ngo',
                organization_name: 'Helping Hands',
                organization_description: 'We help people in need.',
                website_url: 'https://helpinghands.org',
                location: 'San Francisco',
                bio: 'Official NGO account.'
            }
        ];

        await User.insertMany(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
