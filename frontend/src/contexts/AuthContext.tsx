// Import necessary dependencies from React and other modules
import React, { useEffect, useState, createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../utils/auth'
import LoadingPage from '../components/LoadingPage'
import axios from 'axios'

// Define interfaces for role and user data
// interface Role {
//   name: string
// }

interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  roles: string[]
  address: string;
  location : string;
  phone : string;
}

// Define the structure of the authentication context
interface AuthContextType {
  isAuthenticated: boolean
  userRoles: string[]
  user: User | null
  login: (accessToken: string, refreshToken: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null)

// Define the properties expected by the AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // State management for authentication and user information
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  // Effect to initialize authentication when the app loads
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        // Retrieve authentication data from local storage
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userData = localStorage.getItem('user')

        if (accessToken && refreshToken && userData) {
          try {
            // Verify access token by making a request to the backend
            await api.get('auth/me')

            // Parse user data from local storage
            const parsedUserData = JSON.parse(userData) as User
            setIsAuthenticated(true)
            setUserRoles(parsedUserData.roles)
            setUser(parsedUserData)

            // Redirect authenticated users away from login/signup pages
            if (['/login', '/signup', '/'].includes(location.pathname)) {
              const userRole = parsedUserData.roles[0] || 'client'
              navigate(`/${userRole}`)
            }
          } catch (error) {
            // Handle token expiration and attempt token refresh
            try {
              const response = await axios.post(
                '/api/auth/refresh',
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`,
                  },
                }
              )

              // Update access token and user data
              const { access_token } = response.data.data
              localStorage.setItem('accessToken', access_token)
              const parsedUserData = JSON.parse(userData) as User
              setIsAuthenticated(true)
              setUserRoles(parsedUserData.roles)
              setUser(parsedUserData)
            } catch (refreshError) {
              // If refresh token fails, clear authentication data
              console.error('Token refresh failed:', refreshError)
              localStorage.clear()
              setIsAuthenticated(false)
              setUserRoles([])
              setUser(null)
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsAuthenticated(false)
        setUserRoles([])
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [navigate, location.pathname])

  // Effect to handle OAuth redirects (e.g., social login)
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Extract authentication details from URL parameters
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const userData = params.get('user')

      if (accessToken && refreshToken && userData) {
        try {
          // Parse and store authentication data
          const parsedUserData = JSON.parse(userData) as User
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          localStorage.setItem('user', userData)
          setIsAuthenticated(true)
          setUserRoles(parsedUserData.roles)
          setUser(parsedUserData)

          // Determine redirection based on user role
          const primaryRole = parsedUserData.roles[0] || 'client'
          const redirectUrl = sessionStorage.getItem('authRedirectUrl') || `/${primaryRole}`
          sessionStorage.removeItem('authRedirectUrl')
          navigate(redirectUrl, { replace: true })
        } catch (error) {
          console.error('OAuth redirect handling error:', error)
          localStorage.clear()
          setIsAuthenticated(false)
          setUserRoles([])
          setUser(null)
        }
      }
    }

    handleOAuthRedirect()
  }, [navigate])

  // Function to log in a user
  const login = (accessToken: string, refreshToken: string, userData: User) => {
    // Store authentication data in local storage
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))

    // Update authentication state
    setIsAuthenticated(true)
    setUserRoles(userData.roles)
    setUser(userData)

    // Determine redirection path based on user role
    const primaryRole = userData.roles[0] || 'client'
    const from = (location.state as { from?: string })?.from || `/${primaryRole}`
    navigate(from, { replace: true })
  }

  // Function to log out a user
  const logout = async () => {
    setIsLoading(true)
    try {
      await api.post('auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }

    // Clear authentication data and redirect to login page
    localStorage.clear()
    setIsAuthenticated(false)
    setUserRoles([])
    setUser(null)
    navigate('/login')
    setIsLoading(false)
  }

  // Display loading page while authentication state is being determined
  if (isLoading) {
    return <LoadingPage />
  }

  // Provide authentication context to child components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRoles,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
