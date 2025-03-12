import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/auth";
import LoadingPage from "../components/LoadingPage";
import axios from "axios";

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  userRoles: string[];
  user: any; // You might want to define a proper User interface
  login: (accessToken: string, refreshToken: string, roles: string[], userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the AuthContext with an initial value of null
const AuthContext = createContext<AuthContextType | null>(null);


// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component: Manages authentication state and provides it to the app
export function AuthProvider({ children }: AuthProviderProps) {
  // State for authentication status, user roles, and loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Check if tokens and roles are stored in localStorage
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const roles = localStorage.getItem("roles");
        const userData = localStorage.getItem("user");

        if (accessToken && refreshToken && roles && userData) {
          try {
            // Verify the token with the backend
            await api.get("auth/me");

            // If the token is valid, set authentication state and roles
            setIsAuthenticated(true);
            setUserRoles(JSON.parse(roles));
            setUser(JSON.parse(userData));

            // Redirect to the appropriate page based on the user's role
            if (["/login", "/signup", "/"].includes(location.pathname)) {
              const userRole = JSON.parse(roles)[0];
              navigate(`/${userRole}`);
            }
          } catch (error) {
            // If token verification fails, attempt to refresh the token
            try {
              const response = await axios.post("/api/auth/refresh", {}, {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              });
              
              // Store the new access token
              const { access_token } = response.data.data;
              localStorage.setItem("accessToken", access_token);
              
              // Set authentication state
              setIsAuthenticated(true);
              setUserRoles(JSON.parse(roles));
              setUser(JSON.parse(userData));
            } catch (refreshError) {
              // If token refresh fails, clear localStorage and reset state
              console.error("Token refresh failed:", refreshError);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("roles");
              localStorage.removeItem("user");
              setIsAuthenticated(false);
              setUserRoles([]);
              setUser(null);
            }
          }
        }
      } catch (error) {
        // Handle errors during initialization
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
        setUserRoles([]);
        setUser(null);
      } finally {
        // Set loading to false once initialization is complete
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  // Handle OAuth redirects (e.g., after Google login)
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Parse query parameters from the URL
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const roles = params.get("roles");
      const userData = params.get("user");

      if (accessToken && refreshToken && roles && userData) {
        try {
          // Store the tokens and user data in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("roles", roles);
          localStorage.setItem("user", userData);
          
          setIsAuthenticated(true);
          setUserRoles(JSON.parse(roles));
          setUser(JSON.parse(userData));

          // Redirect to the appropriate page based on the user's role
          const redirectUrl =
            sessionStorage.getItem("authRedirectUrl") || `/${JSON.parse(roles)[0]}`;
          sessionStorage.removeItem("authRedirectUrl");
          navigate(redirectUrl, {
            replace: true,
          });
        } catch (error) {
          // Handle errors during OAuth redirect
          console.error("OAuth redirect handling error:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("roles");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUserRoles([]);
          setUser(null);
        }
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  // Handle user login
  const login = (accessToken: string, refreshToken: string,  userData:any) => {
    // Store the tokens and user data in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("roles", JSON.stringify(userData.roles));
    localStorage.setItem("user", JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUserRoles(userData.roles);
    setUser(userData);

    // Redirect to the appropriate page based on the user's role
    const from = (location.state as { from?: string })?.from || `/${userData.roles[0]}`;
    navigate(from, {
      replace: true,
    });
  };

  // Function: Handle user logout
  const logout = async () => {
    setIsLoading(true);
    try {
      // Call the backend logout endpoint (if needed)
      // Note: With JWT, server-side logout is optional since tokens are stateless
      // You might still want to add the token to a blacklist on the server
      await api.post("auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear authentication state and localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roles");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRoles([]);
    setUser(null);
    navigate("/login");
    setIsLoading(false);
  };

  // Show a loading spinner while authentication is being initialized
  if (isLoading) {
    return <LoadingPage />;
  }

  // Provide the authentication context to the app
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
  );
}

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

