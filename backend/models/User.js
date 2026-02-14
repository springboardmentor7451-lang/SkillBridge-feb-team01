const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['volunteer', 'ngo'],
        required: true,
    },
    skills: [String],
    location: String,
    bio: String,
    // NGO specific fields
    organization_name: {
        type: String,
        required: function () { return this.role === 'ngo'; }
    },
    organization_description: {
        type: String,
        required: function () { return this.role === 'ngo'; }
    },
    website_url: {
        type: String,
        required: function () { return this.role === 'ngo'; }
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
