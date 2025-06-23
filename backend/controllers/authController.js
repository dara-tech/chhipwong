// authController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from "../lib/cloudinary.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, type = 'user' } = req.body;
    
    // Validate role
    const validRoles = ['super_admin', 'admin', 'user', 'payment_viewer'];
    if (!validRoles.includes(type)) {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      type 
    });
    await newUser.save();

    // Generate JWT with user type
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email,
        type: newUser.type 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get geolocation info (using ip-api.com)
    let location = null;
    try {
      const fetch = (await import('node-fetch')).default;
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      location = await geoRes.json();
    } catch (geoErr) {
      location = null;
    }

    // Update lastLogin, lastLoginIp, lastLoginLocation
    user.lastLogin = new Date();
    user.lastLoginIp = ip;
    user.lastLoginLocation = location;
    await user.save();

    // Generate JWT with user type
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        type: user.type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        type: user.type,
        lastLogin: user.lastLogin,
        lastLoginIp: user.lastLoginIp,
        lastLoginLocation: user.lastLoginLocation
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getUser = async (req, res) => {
  try {
    // The user ID is already available in req.user from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        type: user.type
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const getProfile = async (req, res) => {
  try {
    // The user ID is already available in req.user from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        type: user.type
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password update if currentPassword and newPassword are provided
    if (currentPassword && newPassword) {
      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash and set new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    } else if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({ message: 'Both current and new password are required to update password' });
    }

    // Handle image upload if present
    if (req.files?.profilePic) {
      const profilePicResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'admin_profiles' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.files.profilePic[0].buffer);
      });

      user.profilePic = profilePicResult.secure_url;
    }

    await user.save();

    // Return updated user data (excluding password)
    const updatedUser = await User.findById(user._id).select('-password');

    // Generate new token if password was changed
    let token = null;
    if (currentPassword && newPassword) {
      token = jwt.sign(
        { 
          id: updatedUser._id, 
          email: updatedUser.email,
          type: updatedUser.type 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        type: updatedUser.type
      },
      ...(token && { token })
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Password update functionality has been merged into updateAdminProfile

export const getCurrentUser = async (req, res) => {
  try {
    // The user is already verified by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Check if the authenticated user is an admin or super_admin
    if (req.user.type !== 'admin' && req.user.type !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden: This action requires admin privileges.' });
    }

    // Fetch all users but exclude their passwords
    const users = await User.find().select('-password');

    return res.status(200).json(users);

  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

export const getUserById = async (req, res) => {
  try {
    // An admin or super_admin should be able to fetch any user's details
    if (req.user.type !== 'admin' && req.user.type !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    // Ensure the requester is an admin or super_admin
    if (req.user.type !== 'admin' && req.user.type !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    const { id } = req.params;
    const { name, email, type } = req.body;

    // Find the user to be updated
    let userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent an admin from changing their own role to something else
    if (req.user.id === id && type && userToUpdate.type !== type) {
      return res.status(400).json({ message: 'Admins cannot change their own role.' });
    }
    
    // Update fields
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;
    if (type) {
      const validRoles = ['admin', 'user', 'payment_viewer'];
      if (!validRoles.includes(type)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
      }
      userToUpdate.type = type;
    }

    const updatedUser = await userToUpdate.save();

    // Return updated user, excluding password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    return res.status(200).json({
      message: 'User updated successfully.',
      user: userResponse,
    });

  } catch (error) {
    console.error('Error updating user by admin:', error);
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Check if the authenticated user is an admin or super_admin
    if (req.user.type !== 'admin' && req.user.type !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden: This action requires admin privileges.' });
    }

    const { id } = req.params;

    // Find the user to delete
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent regular admins from deleting other admins or super_admins
    if (req.user.type === 'admin' && (userToDelete.type === 'admin' || userToDelete.type === 'super_admin')) {
      return res.status(400).json({ message: 'Regular admins cannot delete admin or super admin users.' });
    }

    // Prevent users from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ message: 'Users cannot delete their own account.' });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'User deleted successfully.' });

  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear the token from the client-side
    res.clearCookie('token');

    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};