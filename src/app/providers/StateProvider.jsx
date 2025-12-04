"use client";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation"; // 1. Import Router Hooks

// Key for localStorage
const STORAGE_KEY = "registrationFormState";

export const StateContext = createContext(null);

export default function StateProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  // Function to get initial state from localStorage
  const getInitialState = (key, defaultValue) => {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        try {
          const stateObject = JSON.parse(storedState);
          // 2. Check and return stored state
          return stateObject[key] !== undefined
            ? stateObject[key]
            : defaultValue;
        } catch (e) {
          console.error("Error parsing localStorage state:", e);
          return defaultValue;
        }
      }
    }
    return defaultValue;
  };

  // 3. Derive 'step' from the URL on load (or use stored value if available)
  const [step, setStep] = useState(() => {
    const storedStep = getInitialState("step", 1);

    // Check if we are on a step specific URL (e.g., /register/step_3)
    const match = pathname.match(/\/register\/step_(\d+)$/);
    if (match) {
      const urlStep = parseInt(match[1]);
      // Use the URL step if it's valid, otherwise stick to stored/default
      return urlStep >= 1 && urlStep <= 4 ? urlStep : storedStep;
    }
    return storedStep;
  });

  const [role, setRole] = useState(() => getInitialState("role", ""));
  const [name, setName] = useState(() => getInitialState("name", ""));
  const [email, setEmail] = useState(() => getInitialState("email", ""));
  const [location, setLocation] = useState(() =>
    getInitialState("location", "")
  );
  const [area, setArea] = useState(() => getInitialState("area", ""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- EFFECT FOR PERSISTENCE ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateToStore = JSON.stringify({
        step, // Ensure step is saved
        role,
        name,
        email,
        location,
        area,
      });
      localStorage.setItem(STORAGE_KEY, stateToStore);
    }
  }, [step, role, name, email, location, area]);

  // --- HANDLER FUNCTIONS (Modified for Redirection) ---

  // Step 1 Handler: Select Role
  const handleSetRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
    router.push("/register/step_2"); // Redirect to Step 2 page
  };

  // Step 2 Handler: Name or Email submit
  const SubmitNameOrEmail = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter both name and email.");
      return;
    }
    setStep(3);
    router.push("/register/step_3"); // Redirect to Step 3 page
  };

  // Step 3 Handler: Profile submit
  const SubmitProfile = (e) => {
    e.preventDefault();
    if (!location || !area) {
      toast.error("Please enter both location and preferred legal area.");
      return;
    }
    setStep(4);
    router.push("/register/step_4"); // Redirect to Step 4 page
  };

  // Step 4 Handler: Final Registration Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const registrationData = { name, email, role, location, area, password };
    setLoading(true);

    try {
      // *** REPLACE THIS WITH YOUR ACTUAL API CALL ***
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Account created successfully!");
      // Clear localStorage and redirect to login page after success
      localStorage.removeItem(STORAGE_KEY);
      setStep(1);
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(
        "Registration failed. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    step,
    setStep,
    role,
    setRole,
    name,
    setName,
    email,
    setEmail,
    location,
    setLocation,
    area,
    setArea,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSetRole,
    SubmitNameOrEmail,
    SubmitProfile,
    handleSubmit,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}
