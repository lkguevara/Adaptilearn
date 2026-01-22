import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      stats: {
        totalTopicsCompleted: 0,
        totalRoadmapsStarted: 0,
        totalRoadmapsCompleted: 0,
        totalStudyMinutes: 0,
        averageCompletionRate: 0,
        longestStreak: 0,
        currentStreak: 0,
        preferredTopics: [],
        learningVelocity: 'medium'
      },
      achievements: []
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      message: "Login exitoso",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout exitoso" });
};

export const getUserData = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos del usuario", error: error.message });
  }
};
