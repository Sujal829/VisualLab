import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const Login = ({ onLoginSuccess }) => {
  return (
    // Primary layout wrapper mimicking a secure Google Identity endpoint surface
    <div className="fixed inset-0 z-[100] flex flex-col justify-between items-center bg-[#131314] font-sans antialiased selection:bg-transparent">
      
      {/* Structural alignment spacer for centered desktop environments */}
      <div className="hidden sm:block flex-grow" />

      {/* Main Google Verification Container Box */}
      <div className="w-full sm:max-w-[448px] bg-[#131314] sm:bg-[#1e1f20] p-6 sm:p-10 rounded-none sm:rounded-xl sm:border sm:border-[#424345] flex flex-col justify-between min-h-screen sm:min-h-[500px] box-border">
        
        {/* Core Layout Structure Focus: Security Identity Context Header */}
        <div className="w-full flex flex-col items-start sm:items-center text-left sm:text-center mt-8 sm:mt-0">
          
          {/* Authentic Multi-Color Google Text Brand Vector */}
          <div className="mb-5 flex items-center justify-start sm:justify-center gap-[1px] font-sans font-medium text-[24px] tracking-tight pointer-events-none select-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>

          {/* Core Security Verification Typography Block */}
          <h1 className="text-[#E3E2E6] text-[24px] sm:text-[28px] font-normal tracking-normal leading-tight">
            Verify it's you
          </h1>
          
          {/* Official Google Security Context Subtitle */}
          <p className="text-[#C4C6C5] text-[14px] sm:text-[15px] font-normal mt-3 leading-relaxed tracking-normal max-w-[340px]">
            To help keep your account secure, Google wants to verify your identity. Visit site securely with Google.
          </p>
        </div>
        
        {/* Central Intercept Area: Authentication Component */}
        <div className="w-full flex flex-col justify-center items-center my-auto py-8">
          <div className="w-full max-w-[320px] sm:max-w-[280px]">
            <GoogleLogin
              onSuccess={(response) => {
                const user = jwtDecode(response.credential);
                onLoginSuccess(user);
              }}
              onError={() => {
                console.error("Authentication verification failed.");
                toast.error("Google Login failed. Unauthorized origin detected. Please check your Google Cloud Console settings.");
              }}
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              size="large"
              text="signup_with" // Dynamically renders as "Continue with Google" to mask regular sign-in language
            />
          </div>
        </div>

        {/* Structural Layout Base Padding Anchor */}
        <div className="hidden sm:block h-4" />
      </div>

      {/* Structural alignment spacer for centered desktop environments */}
      <div className="hidden sm:block flex-grow" />

      {/* Standard Universal Google Platform Footer */}
      <div className="w-full max-w-[448px] sm:max-w-[750px] flex flex-col sm:flex-row justify-between items-start sm:items-center text-[12px] text-[#C4C6C5] font-normal px-6 sm:px-4 py-6 box-border gap-4 sm:gap-0">
        
        <div className="hover:text-[#E3E2E6] cursor-pointer transition-colors duration-150 flex items-center gap-1">
          English (United States)
          <span className="text-[8px] opacity-70">▼</span>
        </div>
        
        <div className="flex gap-6">
          <span className="hover:text-[#E3E2E6] cursor-pointer transition-colors duration-150">Help</span>
          <span className="hover:text-[#E3E2E6] cursor-pointer transition-colors duration-150">Privacy</span>
          <span className="hover:text-[#E3E2E6] cursor-pointer transition-colors duration-150">Terms</span>
        </div>
      </div>

    </div>
  );
};

export default Login;
