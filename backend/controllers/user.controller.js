import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register user
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Basic validation
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Process profile picture (only if provided)
        let profilePhotoUrl = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        // Create new user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl, // Will be null if no file is uploaded
            }
        });

        return res.status(201).json({
            message: "Account registered successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// Login user
export const login = async (req, res) => {
    try {

        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect credentials",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect credentials",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role!",
                success: false
            });
        }

        // Generate JWT token
        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "7 days" });


        // Send token in cookie
        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: "None",
            secure: true,


        }).json({
            message: `Welcome ${user.fullname}`,
            success: true,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {

        // Ensure authentication works
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Extract fields
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        let skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];

        // Declare profilePhotoUrl
        let profilePhotoUrl = user.profile.profilePhoto || null;
        let resumeUrl = user.profile?.resume || null;

        // File Handling (Profile Photo)
        if (req.files?.profilePhoto?.[0]) {
            try {
                console.log("Processing Profile Photo:", req.files.profilePhoto[0]);
                const fileUri = getDataUri(req.files.profilePhoto[0]);
                console.log("Generated File URI:", fileUri); // Debug
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                console.log("Cloudinary Response:", cloudResponse);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (fileError) {
                console.error("Cloudinary Upload Error:", fileError);
                return res.status(500).json({ success: false, message: "Profile picture upload failed", error: fileError.message });
            }
        }

        // File Handling (Resume)
        if (req.files?.resume?.[0]) {
            try {
                const fileUri = getDataUri(req.files.resume[0]);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                resumeUrl = cloudResponse.secure_url;
            } catch (fileError) {
                console.error("Cloudinary Upload Error:", fileError);
                return res.status(500).json({ success: false, message: "File upload failed", error: fileError.message });
            }
        }

        // Update user data
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profile.bio = bio || user.bio;
        user.profile.skills = skillsArray.length > 0 ? skillsArray : user.skills;
        user.profile.resume = resumeUrl;

        console.log("Existing Profile Photo:", user.profilePhoto);
        console.log("New Profile Photo URL:", profilePhotoUrl);

        if (profilePhotoUrl) {
            user.profile.profilePhoto = profilePhotoUrl;
        }

        console.log("Updated Profile Photo in User Object:", user.profilePhoto);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profilePhoto: user.profile.profilePhoto,
                resume: user.resume,
                bio: user.profile.bio,
                skills: user.profile.skills,
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const getAnalyticsData = async (req, res) => {
    try {
        const students = await User.find();

        // Job Application Trends
        const applications = students.flatMap(student => student.applications);

        // Skill Relevance
        const totalSkills = students.flatMap(student => student.skills).length;
        const matchedSkills = students.flatMap(student => student.matchedSkills).length;
        const skillRelevance = ((matchedSkills / totalSkills) * 100).toFixed(2);

        // Industry Demand
        const industryCount = {};
        students.forEach(student => {
            student.jobListings.forEach(job => {
                industryCount[job.industry] = (industryCount[job.industry] || 0) + 1;
            });
        });

        // Success Rate
        const totalApplications = applications.length;
        const totalInterviews = students.flatMap(student => student.interviewCalls).length;
        const successRate = ((totalInterviews / totalApplications) * 100).toFixed(2);

        res.status(200).json({
            applicationTrends: applications,
            skillRelevance,
            industryDemand: industryCount,
            successRate
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
