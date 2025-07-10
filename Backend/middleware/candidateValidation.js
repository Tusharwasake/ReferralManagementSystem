// Validation middleware for candidate operations

const validateCandidateData = (req, res, next) => {
  const { name, email, phone, jobTitle } = req.body;

  // Check required fields
  if (!name || !email || !phone || !jobTitle) {
    return res.status(400).json({
      error: "All fields are required: name, email, phone, jobTitle",
    });
  }

  // Validate name
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 100
  ) {
    return res.status(400).json({
      error: "Name must be between 2 and 100 characters",
    });
  }

  // Validate email
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Please enter a valid email address",
    });
  }

  // Validate phone
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: "Please enter a valid phone number",
    });
  }

  // Validate job title
  if (
    typeof jobTitle !== "string" ||
    jobTitle.trim().length < 2 ||
    jobTitle.trim().length > 100
  ) {
    return res.status(400).json({
      error: "Job title must be between 2 and 100 characters",
    });
  }

  // Validate notes if provided
  if (req.body.notes && req.body.notes.length > 500) {
    return res.status(400).json({
      error: "Notes cannot exceed 500 characters",
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      error: "Status is required",
    });
  }

  const validStatuses = ["Pending", "Reviewed", "Hired", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
    });
  }

  // Validate notes if provided
  if (req.body.notes && req.body.notes.length > 500) {
    return res.status(400).json({
      error: "Notes cannot exceed 500 characters",
    });
  }

  next();
};

const validateCandidateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return res.status(400).json({
      error: "Valid candidate ID is required",
    });
  }

  next();
};

const validatePaginationParams = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      error: "Page must be a positive integer",
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      error: "Limit must be a positive integer between 1 and 100",
    });
  }

  const { sortBy } = req.query;
  if (sortBy) {
    const validSortFields = [
      "name",
      "email",
      "jobTitle",
      "status",
      "referredDate",
      "lastUpdated",
    ];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sort field. Valid fields are: ${validSortFields.join(
          ", "
        )}`,
      });
    }
  }

  const { sortOrder } = req.query;
  if (sortOrder && !["asc", "desc"].includes(sortOrder)) {
    return res.status(400).json({
      error: "Sort order must be 'asc' or 'desc'",
    });
  }

  next();
};

export {
  validateCandidateData,
  validateStatusUpdate,
  validateCandidateId,
  validatePaginationParams,
};
