import jwt from 'jsonwebtoken';

const generateToken = (userId, username) => {
  return jwt.sign(
    { userId: admin._id, username: admin.username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
  );
};

export default generateToken;
