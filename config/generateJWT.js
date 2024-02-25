import jwt from "jsonwebtoken";

//ENG: Function to generate JWT token
// UZ: jwt token generat qilish uchun funksiya
function generateToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}

export default generateToken;
