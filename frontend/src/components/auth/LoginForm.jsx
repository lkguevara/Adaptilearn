import { Mail, Lock, Eye, EyeOff} from 'lucide-react';
import { useState } from 'react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center px-4">
      <article className="w-full max-w-md mx-auto py-24 px-6 text-center inset-shadow-sm shadow-sm rounded-2xl">
        <h1 className="font-bold text-primary text-2xl md:text-3xl mb-1">  
            Bienvenido de nuevo
        </h1>
        <p className="text-sm text-primary">Continúa tu viaje de aprendizaje</p>

        {/* Formulario de inicio de sesión */}
        <form className="space-y-6 mt-6 text-left">
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
                {showPassword ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2  text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

      </article>
    </section>

  )
}

export default LoginForm