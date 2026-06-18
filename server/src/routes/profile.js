// // server/src/routes/profile.js



// import express from "express";
// import { getProfile, updateProfile } from "../controllers/profileController.js";
// import { auth } from "../middleware/auth.js";

// const router = express.Router();

// router.get("/", auth, getProfile);
// router.put("/", auth, updateProfile);

// export default router;


// server/src/routes/profile.js

import express from "express";
import { 
  getProfile, 
  updateProfile, 
  changePassword,
  deactivateAccount,
  deleteAccount,
  upload 
} from "../controllers/profileController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/profile - Get user profile
router.get("/", auth, getProfile);

// PUT /api/profile - Update profile (with avatar upload)
router.put("/", auth, upload.single('avatar'), updateProfile);

// PUT /api/profile/change-password - Change password
router.put("/change-password", changePassword);

// PATCH /api/profile/deactivate - Deactivate account
router.patch("/deactivate", deactivateAccount);

// DELETE /api/profile - Delete account permanently
router.delete("/", deleteAccount);

export default router;