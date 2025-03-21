// import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Paper, Typography, FormControlLabel, Checkbox, Grid, Alert } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../../components/GoogleButton";
import { TextField } from "../../components/form/TextField";
import { UserTypeSelector } from "../../components/form/UserTypeSelector";
import { PasswordStrengthIndicator } from "../../components/form/PasswordStrengthIndicator";
import { signupSchema, type SignupFormData } from "../../utils/validation";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../utils/auth";
import LoadingPage from "../../components/LoadingPage";


export function SignUp() {
  const navigate = useNavigate();
  const { 
    control,
    handleSubmit,
    watch,
    getValues,
    formState: {
      isSubmitting,
      errors
    },
    setValue
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "client",
      barNumber: ""
    },
    mode : 'all'
  });

  
  const userType = watch("userType");
  const password = watch('password')

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormData) => {
      return authApi.signup(data)
    },
    onSuccess: (response) => {
      navigate('/login', {
        state: {
          message: response.data?.message || 'Account created successfully. Please log in.',
        },
      })
    },

    onError: (error) => console.log(error)
  })

  // Asynchronous form submisson to handle signup form submission
  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
    // console.log(data)
  };

  if (signupMutation.isPending) {
    return <LoadingPage />;
  }

  // Handle changes to the user type selection
  const handleUserTypeChange = (type: "client" | "lawyer") => {
    setValue("userType", type);
    if (type === "client") {
      // clear the 'barNumber' field if the selected field is of type client
      setValue("barNumber", "");
    }
  };
  return <Box className="w-full min-h-screen bg-white pt-20">
      <Box className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Box className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="hidden lg:block lg:w-1/2 relative">
            <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?uid=R187223128&ga=GA1.1.1439759661.1737426593&semt=ais_hybrid" alt="Signup illustration" className="w-full max-w-md mx-auto fixed left-[120px] top-[120px]" />
          </motion.div>

          {/* Form container */}
          <motion.div 
          initial={{ opacity: 0, y: 20}}
           animate={{ opacity: 1, y: 0}} 
           className="w-full lg:w-1/2 max-w-md">
            <Paper className="p-8">
              <Box className="mb-6 flex items-center justify-between">
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Typography variant="h5" className="text-center flex-1">
                  Create Account
                </Typography>


                {/* User type selector */}
                <UserTypeSelector 
                selectedType={userType}
                 onChange={handleUserTypeChange} />
              </Box>
              
              {/* Google signup button */}
              <div className="flex flex-col space-y-4">
              <GoogleAuthButton  type="signup" />
              <Divider className="my-6">Or continue with</Divider>
              </div>

              {/* Display error messge if signup attempt fails */}
              {signupMutation.isError && (
                <Alert severity="error"
                className="mb-4">
                  Something went wrong. Please try again.
                </Alert>)}

                {/* signup Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* first and last name fields */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField 
                    name="firstName" 
                    control={control} 
                    label="First Name" 
                    required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                    name="lastName" 
                    control={control} 
                    label="Last Name" 
                    required />
                  </Grid>
                </Grid>

                {/* Email field */}
                <TextField name="email" control={control} label="Email" type="email" required />

                {/* Conditionally render bar number field */}
                {userType === "lawyer" && (
                  <TextField 
                  name="barNumber" 
                  control={control} 
                  label="Bar Number" 
                  required />)}
                
                {/* password field */}
                <TextField 
                name="password" 
                control={control}
                 label="Password" 
                 type="password" 
                 required />
                 {/* Password strength indicator */}
                <PasswordStrengthIndicator password={password || ""} />
                {/* confirm Password field */}
                <TextField 
                name="confirmPassword" 
                control={control} 
                label="Confirm Password"
                type="password"
                required />

                {/* Terms of service and privacy policy agreement */}
                <FormControlLabel control={<Checkbox required color="primary" />} label={<Typography variant="body2">
                      I agree to the{" "}
                      <Link to="/terms" className="text-[#0066ff] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-[#0066ff] hover:underline">
                        Privacy Policy
                      </Link>
                    </Typography>} />
                
                {/* Signup button */}
                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{
                mt: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                bgcolor: "#0066ff",
                "&:hover": {
                  bgcolor: "#0052cc"
                }
              }}>
                  {isSubmitting ? "Creating Account..." : "Sign up"}
                </Button>

                {/* Link to login page */}
                <Box className="text-center mt-4">
                  <Typography variant="body2" color="textSecondary">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#0066ff] hover:underline">
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </motion.div>
        </Box>
      </Box>
    </Box>;
}