const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, skills, location, bio, organization_name, organization_description, website_url } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Role-specific validation
        if (role === 'ngo') {
            if (!organization_name || !organization_description || !website_url) {
                return res.status(400).json({ message: 'Please add all NGO required fields' });
            }
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object based on role
        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            skills,
            location,
            bio
        };

        if (role === 'ngo') {
            userData.organization_name = organization_name;
            userData.organization_description = organization_description;
            userData.website_url = website_url;
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { _id, name, email, role, skills, location, bio, organization_name, organization_description, website_url } = user;

        const userData = {
            id: _id,
            name,
            email,
            role,
            skills,
            location,
            bio
        };

        if (role === 'ngo') {
            userData.organization_name = organization_name;
            userData.organization_description = organization_description;
            userData.website_url = website_url;
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: error.message || 'Server error fetching user' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
