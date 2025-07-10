import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Hired", "Rejected"],
      default: "Pending",
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    resumeFileName: {
      type: String,
      default: null,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    referredDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdated field on save
candidateSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Update lastUpdated field on update
candidateSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  this.set({ lastUpdated: new Date() });
  next();
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
