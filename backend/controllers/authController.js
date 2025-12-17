import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // A. Validar campos
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // B. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true, // Solo se puede acceder a la cookie desde el servidor    
      secure: false,  // Cambiar a true si se usa HTTPS en producción 
      sameSite: 'strict',  // Previene el envío de la cookie en solicitudes cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({
      _id: user._id,
      email: user.email,
      message: "Login successful"
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout successful" });
};
