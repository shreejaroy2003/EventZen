import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, appleProvider } from "./firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";

function App() {
  const [showLogin, setShowLogin] = useState(false); // State to control popup visibility
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [user, setUser] = useState(null); // Holds user data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [location, setLocation] = useState(null); // City and State
  const [error, setError] = useState(""); // Error message for location

  const API_KEY = "c9c675b083e320df227e4c03dcbfb712"; // Your OpenWeatherMap API key

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  // Apple Login
  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Apple Login Error:", error.message);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Email Login Error:", error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Location Detection
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch location data.");
            }

            const data = await response.json();
            if (data && data.length > 0) {
              const { name, state } = data[0];
              setLocation({ city: name, state });
              setError("");
            } else {
              setError("Unable to retrieve city and state.");
            }
          } catch (err) {
            console.error("Geocoding Error:", err.message);
            setError("Unable to retrieve location.");
          }
        },
        (err) => {
          console.error("Location Error:", err.message);
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Search Handler
  const handleSearch = () => {
    alert(`You searched for: ${searchQuery}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography variant="h6" sx={{ flex: 1 }}>
            EventZen
          </Typography>

          {/* Search Bar */}
          <Box sx={{ flex: 2, display: "flex", justifyContent: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                width: "60%",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => setShowLogin(true)}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained">Business Events</Button>
          <Button variant="contained">Social Events</Button>
          <Button variant="contained">Community Events</Button>
          <Button variant="contained">Virtual Events</Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={detectLocation}>
            Detect Location
          </Button>
          <Button variant="outlined">Gift Cards</Button>
          <Button variant="outlined">Offers</Button>
        </Box>
      </Box>

      {/* Location Display */}
      {location && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          Your location: {location.city}, {location.state}
        </Box>
      )}
      {error && (
        <Box sx={{ textAlign: "center", color: "red", mt: 2 }}>{error}</Box>
      )}

      {/* Login Dialog */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
        <DialogTitle>
          Login
          <IconButton
            aria-label="close"
            onClick={() => setShowLogin(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Login with Google
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAppleLogin}
            sx={{ mb: 2 }}
          >
            Login with Apple
          </Button>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleEmailLogin}>
            Login with Email
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogin(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
