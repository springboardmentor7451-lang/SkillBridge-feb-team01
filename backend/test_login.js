import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["volunteer", "ngo"], required: true },
});

const User = mongoose.model("User", userSchema);

async function checkUser() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "ngo@skillbridge.org";
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`User ${email} NOT found.`);
    } else {
        console.log(`User ${email} found! Role: ${user.role}`);
        const isMatch = await bcrypt.compare("password123", user.password);
        console.log(`Password match for 'password123': ${isMatch}`);
        console.log(`Stored Hash: ${user.password}`);
    }

    console.log("\n--- All Users ---");
    const users = await User.find({}, 'email role');
    console.log(users);

    await mongoose.disconnect();
}

checkUser().catch(console.error);
