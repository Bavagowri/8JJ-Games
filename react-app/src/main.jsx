// react-app/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SearchProvider } from "./context/SearchContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from './context/ProfileContext';
import { useAuth } from "./context/AuthContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    <AuthProvider>
      <ProfileProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <SearchProvider>
            <App />
          </SearchProvider>
        </GoogleOAuthProvider>
      </ProfileProvider>
    </AuthProvider>    
  </React.StrictMode>
);
