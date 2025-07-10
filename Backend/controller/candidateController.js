import Candidate from "../models/candidate.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/resumes";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create a new candidate
const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobTitle, notes } = req.body;
    const referredBy = req.user._id;

    // Check if candidate with this email already exists
    const existingCandidate = await Candidate.findOne({
      email: email.toLowerCase(),
    });
    if (existingCandidate) {
      return res.status(400).json({
        error: "Candidate with this email already exists",
      });
    }

    // Prepare candidate data
    const candidateData = {
      name,
      email: email.toLowerCase(),
      phone,
      jobTitle,
      referredBy,
      notes: notes || "",
    };

    // Handle resume upload if file is provided
    if (req.file) {
      candidateData.resumeUrl = `/uploads/resumes/${req.file.filename}`;
      candidateData.resumeFileName = req.file.originalname;
    }

    const candidate = new Candidate(candidateData);
    await candidate.save();

    // Populate referredBy field for response
    await candidate.populate("referredBy", "name email");

    res.status(201).json({
      message: "Candidate referred successfully",
      candidate,
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Get all candidates with filtering and pagination
const getAllCandidates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      jobTitle,
      search,
      sortBy = "referredDate",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const candidates = await Candidate.find(filter)
      .populate("referredBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    const totalCandidates = await Candidate.countDocuments(filter);
    const totalPages = Math.ceil(totalCandidates / limit);

    res.status(200).json({
      message: "Candidates retrieved successfully",
      candidates,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCandidates,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Get candidate by ID
const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id).populate(
      "referredBy",
      "name email"
    );

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Candidate retrieved successfully",
      candidate,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid candidate ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Update candidate status
const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Status is required",
      });
    }

    const validStatuses = ["Pending", "Reviewed", "Hired", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Valid statuses are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const updateData = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const candidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("referredBy", "name email");

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Candidate status updated successfully",
      candidate,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid candidate ID",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Update candidate details
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, jobTitle, notes } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (jobTitle) updateData.jobTitle = jobTitle;
    if (notes !== undefined) updateData.notes = notes;

    const candidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("referredBy", "name email");

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Candidate updated successfully",
      candidate,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid candidate ID",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found",
      });
    }

    // Delete resume file if it exists
    if (candidate.resumeUrl) {
      const filePath = path.join(process.cwd(), candidate.resumeUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting resume file:", err);
      });
    }

    await Candidate.findByIdAndDelete(id);

    res.status(200).json({
      message: "Candidate deleted successfully",
      deletedCandidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid candidate ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Get candidate statistics
const getCandidateStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();

    const candidatesByStatus = await Candidate.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const candidatesByJobTitle = await Candidate.aggregate([
      {
        $group: {
          _id: "$jobTitle",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get recent candidates
    const recentCandidates = await Candidate.find()
      .populate("referredBy", "name email")
      .sort({ referredDate: -1 })
      .limit(5)
      .select("name jobTitle status referredDate");

    // Get candidates referred in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReferrals = await Candidate.countDocuments({
      referredDate: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      message: "Candidate statistics retrieved successfully",
      stats: {
        totalCandidates,
        candidatesByStatus: candidatesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        candidatesByJobTitle,
        recentReferralsLast30Days: recentReferrals,
        recentCandidates,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        error: "Candidate not found",
      });
    }

    if (!candidate.resumeUrl) {
      return res.status(404).json({
        error: "Resume not found for this candidate",
      });
    }

    const filePath = path.join(process.cwd(), candidate.resumeUrl);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Resume file not found on server",
      });
    }

    res.download(filePath, candidate.resumeFileName || "resume.pdf");
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid candidate ID",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

export {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  updateCandidate,
  deleteCandidate,
  getCandidateStats,
  downloadResume,
};
