import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "employee",
    enum: ["employee", "HR", "admin"],
  },
  skills: [String],
  createdAt: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema);
export default Users;
