import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";
import Goal from "./src/models/goal.model.js";
import Log from "./src/models/log.model.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany();
    await Goal.deleteMany();
    await Log.deleteMany();

    // Users with known plain passwords
    const usersData = [
      { fullName: "Vaishnavi Bharanale", email: "vaishnavi@example.com", password: "vaishnavi123" },
      { fullName: "Rohan Deshmukh", email: "rohan@example.com", password: "rohan123" },
      { fullName: "Sneha Patil", email: "sneha@example.com", password: "sneha123" },
      { fullName: "Amit Joshi", email: "amit@example.com", password: "amit123" },
      { fullName: "Priya Kulkarni", email: "priya@example.com", password: "priya123" },
      { fullName: "Rahul Shinde", email: "rahul@example.com", password: "rahul123" },
      { fullName: "Anjali More", email: "anjali@example.com", password: "anjali123" },
      { fullName: "Karan Patil", email: "karan@example.com", password: "karan123" },
      { fullName: "Neha Pawar", email: "neha@example.com", password: "neha123" },
      { fullName: "Omkar Jadhav", email: "omkar@example.com", password: "omkar123" },
    ];

    // Hash passwords
    const users = await Promise.all(
      usersData.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(users);
    console.log("✅ Users inserted:", createdUsers.length);

    // Create goals linked to each user
    const goals = createdUsers.map((user) => ({
      user: user._id,
      title: "Quit Smoking Goal",
      targetCigarettes: Math.floor(Math.random() * 10) + 5, // 5–14
      targetDate: new Date("2025-11-30"),
    }));

    await Goal.insertMany(goals);
    console.log("✅ Goals inserted:", goals.length);

    // Valid moods based on your Log schema
    const validMoods = ["happy", "stressed", "sad", "bored", "anxious", "neutral"];

    // Create logs linked to each user
    const logs = createdUsers.map((user) => ({
      user: user._id,
      date: new Date(),
      mood: validMoods[Math.floor(Math.random() * validMoods.length)],
      quantity: Math.floor(Math.random() * 5) + 1, // min 1
    }));

    await Log.insertMany(logs);
    console.log("✅ Logs inserted:", logs.length);

    console.log("🎉 Dummy data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
