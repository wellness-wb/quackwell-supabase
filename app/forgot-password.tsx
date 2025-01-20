import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { sendPasswordResetLink } from "../src/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetLink(email);
      alert("Password reset email sent! Please check your inbox.");
      // After sending the password reset link, navigate to the login screen or another appropriate page
      router.replace("/");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Forgot Password</Text>

      <TextInput
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Send Reset Email" onPress={handleResetPassword} />
    </View>
  );
}
