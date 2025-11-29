import jwt from "jsonwebtoken";

const generateToken = (id, role, email, name) => {
  return jwt.sign(
    { id, role, email, name }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
  );
};

export default generateToken;
