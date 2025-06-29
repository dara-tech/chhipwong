// AdminLogin.js
import { useState, useEffect, memo } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// Memoized input component for better performance
const InputField = memo(({ 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  showPassword, 
  setShowPassword 
}) => (
  <div className="relative group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input input-bordered border-primary/50 focus:border-primary bg-base-200/50 focus:bg-base-100 transition-all duration-300 w-full pl-10 font-body"
      placeholder={placeholder}
      required
    />
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 group-focus-within:text-primary transition-colors duration-300 w-5 h-5" />
    {type === "password" && (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-primary transition-colors duration-300"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    )}
  </div>
))

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { error, loading, handleLogin, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(location.search)
      const from = params.get('from') || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, location.search, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin(credentials)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 px-4">
      <div className="card w-full max-w-md bg-base-100/95 backdrop-blur-sm border border-primary/20 shadow-xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h2 className="crypto-heading text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {location.pathname.includes('admin') ? 'Admin Login' : 'Login'}
            </h2>
            <p className="text-base-content/70 font-accent">Welcome to the future of crypto</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="alert alert-error mb-6"
              >
                <AlertCircle className="w-6 h-6" />
                <span className="font-accent">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-accent">Email</span>
              </label>
              <InputField
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={Mail}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-accent">Password</span>
              </label>
              <InputField
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={Lock}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </div>

            <div className="form-control mt-8">
              <button 
                type="submit" 
                className={`btn btn-primary w-full font-accent text-lg relative overflow-hidden ${loading ? "loading" : ""}`} 
                disabled={loading}
              >
                <span className="relative z-10">
                  {loading ? "Authenticating..." : "Login"}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/register" 
              className="text-sm text-primary/70 hover:text-primary font-accent transition-colors duration-300"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LoginPage)
