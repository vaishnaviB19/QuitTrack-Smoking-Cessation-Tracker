import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropUsernameIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const collection = mongoose.connection.collection("users");

    // Drop the old username_1 index
    const indexes = await collection.indexes();
    const hasUsernameIndex = indexes.some(idx => idx.name === "username_1");

    if (hasUsernameIndex) {
      await collection.dropIndex("username_1");
      console.log("✅ Dropped index 'username_1' successfully");
    } else {
      console.log("ℹ️ No 'username_1' index found");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error dropping index:", err);
    process.exit(1);
  }
};

dropUsernameIndex();
