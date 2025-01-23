import { supabase } from "../supabase";

// Signup
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      console.error("Error:", (error as { message: string }).message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
  return data;
}

// Login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (typeof error === "object" && error !== null && "message" in error) {
      if ((error as { message: string }).message === "Email not confirmed") {
        throw new Error("Please confirm your email address before logging in.");
      } else {
        console.error("Error:", (error as { message: string }).message);
      }
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }

  return data;
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign-out error:", error.message);
    throw error;
  }
}

// Function to send the password reset link
export async function sendPasswordResetLink(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.EXPO_PUBLIC_RESET_PASSWORD_URL + "reset-password",
  });

  if (error) {
    console.error("Error sending password reset link:", error.message);
    throw error;
  }

  return data;
}
