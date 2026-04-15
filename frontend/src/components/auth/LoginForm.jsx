import { Mail, Lock, Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center px-4">
      <article className="w-full max-w-md mx-auto py-12 px-6 text-center inset-shadow-sm shadow-sm rounded-2xl">
        <h1 className="font-bold text-primary text-2xl md:text-3xl mb-1">  
            Bienvenido de nuevo
        </h1>
        <p className="text-sm text-gray-500">Continúa tu viaje de aprendizaje</p>

        {/* Formulario de inicio de sesión */}
        <form className="space-y-6 mt-6 text-left">
        {/* email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-primary">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@email.com"
                className="w-full border-2 border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-gray-500 pl-10"
              />
              
            </div>
          </div>

        {/* password */}
          <div>
            <label htmlFor="password" className=" text-sm font-medium text-primary">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-gray-500 pl-10"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <Eye className="w-4 h-4 text-gray-500 cursor-pointer" /> : <EyeOff className="w-4 h-4 text-gray-500 cursor-pointer" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-center">
            <Link to="#" className="font-medium text-primary">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 cursor-pointer" 
          >
            Iniciar sesión
          </button>

          {/* google sign in */}
          <div className="relative mt-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-300" />
            <span className="absolute bg-white px-2 text-sm text-gray-500">O continúa con</span>
          </div>

          <div className="my-8">
            <button
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              <Link to="#" className="font-medium text-gray-600">
                Iniciar sesión con Google
              </Link>
            </button>
          </div>

        </form>

      </article>
    </section>

  )
}

export default LoginForm
