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

// Important: do NOT use the pre-save hook here so we don't accidentally double-hash if using findOneAndUpdate
const User = mongoose.model("User", userSchema);

async function fixUser() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "ngo@skillbridge.org";

    // Generate the correct hash directly
    const salt = await bcrypt.genSalt(10);
    const correctHash = await bcrypt.hash("password123", salt);

    // Update the user directly in DB bypassing Mongoose hooks
    const result = await User.updateOne(
        { email },
        { $set: { password: correctHash } }
    );

    console.log(`Update result:`, result);

    const user = await User.findOne({ email });
    if (user) {
        console.log(`User ${email} found! Testing compare...`);
        const isMatch = await bcrypt.compare("password123", user.password);
        console.log(`Password match after fix: ${isMatch}`);
    }

    await mongoose.disconnect();
}

fixUser().catch(console.error);
