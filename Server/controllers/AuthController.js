// const User = require('../Models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // =========================
// // COOKIE CONFIG (LIVE)
// // =========================
// const cookieOptions = {
//   httpOnly: true,
//   secure: true,     // required for HTTPS (Render)
//   sameSite: "Lax", // required for mobile cross-site cookies
//   path: '/',
//   // domain: ".onrender.com"
//   //  domain: ".vercel.app",

// };

// // =========================
// // LOCAL DEV VERSION (COMMENTED)
// // =========================

// // const cookieOptions = {
// //   httpOnly: true,
// //   secure: false,
// //   sameSite: "Lax",
// //   path: '/',
// // };


// // =========================
// // Refresh Access Token
// // =========================
// const refreshToken = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ error: 'No refresh token provided.' });

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//     const user = await User.findById(decoded.userId);
//     if (!user || user.refreshToken !== token) {
//       return res.status(403).json({ error: 'Invalid refresh token.' });
//     }

//     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '15m',
//     });

//     res.cookie('accessToken', accessToken, {
//       ...cookieOptions,
//       maxAge: 15 * 60 * 1000,
//     });

//     return res.status(200).json({ message: 'Access token refreshed.' });

//   } catch (err) {
//     console.error(err);
//     return res.status(403).json({ error: 'Failed to refresh access token.' });
//   }
// };

// // =========================
// // Login User
// // =========================
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ error: 'Invalid credentials.' });
//     }

//     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
//     const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

//     user.refreshToken = refreshToken;
//     await user.save();

//     res.cookie('accessToken', accessToken, {
//       ...cookieOptions,
//       maxAge: 15 * 60 * 1000,
//     });

//     res.cookie('refreshToken', refreshToken, {
//       ...cookieOptions,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({ message: 'Login successful.' });

//   } catch (err) {
//     console.error('Login error:', err.message);
//     return res.status(500).json({ error: 'Error logging in.' });
//   }
// };

// // =========================
// // Logout User
// // =========================
// const logoutUser = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(400).json({ error: 'No refresh token found.' });

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//     const user = await User.findById(decoded.userId);
//     if (user) {
//       user.refreshToken = null;
//       await user.save();
//     }

//     res.clearCookie('accessToken', cookieOptions);
//     res.clearCookie('refreshToken', cookieOptions);

//     return res.status(200).json({ message: 'Logout successful.' });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Error logging out.' });
//   }
// };

// // =========================
// // Create User
// // =========================
// const createUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     return res.status(201).json({ message: 'User created successfully.' });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Error creating user.', message: err.message });
//   }
// };




// module.exports = {
//   refreshToken,
//   loginUser,
//   logoutUser,
//   createUser,
// };


const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../Models/user");
const { verifyAccessToken } = require("../middleware/authMiddleware");


//local test no domain
// const cookieOptions = {
//   httpOnly: true,
//   secure: true,     // required for HTTPS
//   sameSite: "None", // works cross-site (mobile / web)
//   path: "/",
//   // domain: ".reviewer-app.xyz", // optional
// };

const cookieOptions = {
  httpOnly: true,
  secure: true,     // required for HTTPS
  sameSite: "None", // works cross-site (mobile / web)
  path: "/",
  domain: ".reviewer-app.xyz", // optional
};


// =========================
// CREATE USER
// =========================
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating user.", message: err.message });
  }
};

// =========================
// LOGIN USER
// =========================
const loginUser = async (req, res) => {
  const { email, password, clientType = "web" } = req.body;

  // 1️⃣ Missing fields
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
      type: "user",
    });
  }

  try {
    const user = await User.findOne({ email });

    // 2️⃣ Invalid credentials (generic for security)
    const isValid = user && (await bcrypt.compare(password, user.password));
    if (!isValid) {
      return res.status(400).json({
        error: "Email or password is incorrect.",
        type: "user",
      });
    }

    // 3️⃣ Generate tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 5️⃣ Send refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6️⃣ Safe user object
    const safeUser = { _id: user._id, name: user.name };

    // 7️⃣ Send response
    if (clientType === "web") {
      res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      return res.status(200).json({ message: "Login successful.", user: safeUser });
    } else {
      return res
        .status(200)
        .json({ message: "Login successful.", accessToken, user: safeUser });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      error: "Oops! Something went wrong. Please try again later.",
      type: "system",
    });
  }
};


// =========================
// REFRESH TOKEN
// =========================
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token provided." });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) return res.status(403).json({ error: "Invalid refresh token." });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const clientType = req.body?.clientType || "web";
    if (clientType === "web") {
      res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      return res.status(200).json({ message: "Access token refreshed." });
    } else {
      return res.status(200).json({ message: "Access token refreshed.", accessToken });
    }
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: "Failed to refresh access token." });
  }
};

// =========================
// LOGOUT USER
// =========================
const logoutUser = async (req, res) => {
  try {
    let token = req.cookies.refreshToken;

    // fallback to header token
    if (!token && req.headers.authorization) {
      const headerToken = req.headers.authorization.split(" ")[1];
      try {
        jwt.verify(headerToken, process.env.JWT_REFRESH_SECRET);
        token = headerToken;
      } catch {
        token = null;
      }
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch {}
    }

    // clear cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error logging out." });
  }
};



// Example: optional authentication check
const getProfile = async (req, res) => {
  const user = await verifyAccessToken(req);
  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const safeUser = { _id: user._id, name: user.name, };
  res.json({ message: "User is authenticated!", user: safeUser });
};

module.exports = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  getProfile
};
