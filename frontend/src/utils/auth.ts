import axios from "axios";
import { LoginFormData, SignupFormData, ForgotPasswordFormData } from "./validation";

// Create axios instance with default config
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, 
(error) => Promise.reject(error));

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await axios.post("/api/auth/refresh", {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        const { access_token } = response.data.data;
        localStorage.setItem("accessToken", access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface Role {
  name: string;
}

interface User {
  email: string;
  full_name: string;
  roles: Role[];
}

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  imageUrl?: string;
  rating: number;
  casesHandled: number;
  location: string;
}

interface FindLawyerResponse {
  data: {
    lawyers: Lawyer[];
  };
  message: string;
  status: "success" | "error";
}

interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message: string;
  status: "success" | "error";
}

interface Case {
  id: string;
  title: string;
  description: string;
  category: string | null;
  status: 'Active' | 'Pending' | 'Closed' | 'On Hold';
  client: string;
  lawyer: string | null;
}

interface GetCasesResponse {
  data: Case[];
  status: "success";
}

interface AvailableCasesResponse {
  available_cases: Case[];
}

interface HandleCaseResponse {
  message: string;
  status: "success" | "error";
}

interface Category {
  id: string;
  name: string;
}

interface AssignedCase {
  id: string;
  title: string;
  description: string;
  category: string | null;
  status: string;
  client: string;
  lawyer: string;
  updated: string;
}

interface GetAssignedCasesResponse {
  data: { assigned_cases: never[]; };
  assigned_cases: AssignedCase[];
}

// API endpoints for authentication
export const authApi = {
  login: (data: LoginFormData): Promise<AuthResponse> => {
    return api.post("/auth/login", data);
  },
  signup: (data: Omit<SignupFormData, "confirmPassword">): Promise<AuthResponse> => {
    // const { confirmPassword, ...signupData } = data;
    return api.post("/auth/register", data);
  },
  forgotPassword: (data: ForgotPasswordFormData) => {
    return api.post("/auth/forgot-password", data);
  },
  logout: () => {
    return api.post("/auth/logout");
  },
  // Google OAuth endpoints
  googleAuth: (type: "login" | "signup") => {
    const backendUrl = "http://127.0.0.1:5000";
    return `${backendUrl}/auth/google?auth_type=${type}`;
  },
  submitCase: (userId: string, formData: FormData) => {
    return api.post(`/client/case-submit/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  findLawyers: (specialization: string): Promise<FindLawyerResponse> => {
    return api.post("/client/find-lawyer", {
      specialization,
    });
  },
  getCases: (userId: string): Promise<GetCasesResponse> => {
    return api.get(`/client/cases/${userId}`);
  },
  // Get assigned cases for lawyers
  getAssignedCases: (): Promise<GetAssignedCasesResponse> => {
    return api.get("/lawyer/assigned-cases");
  },
  // Get available cases with categories
  getAvailableCases: (): Promise<AvailableCasesResponse> => {
    return api.get("/lawyer/available-case");
  },
  // Handle a specific case
  handleCase: (caseId: string): Promise<HandleCaseResponse> => {
    return api.get(`/lawyer/handle-cases/${caseId}`);
  },
};

export type { Lawyer, Case, Category };