import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { signUp } from "../src/auth";

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      alert("Sign-up success! Please check your email for confirmation link.");
      // Navigate to the login page after successful sign-up
      router.replace("/login");
    } catch (error) {
      console.error(error);
      alert(`Sign-up error: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Sign Up</Text>

      <TextInput
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Sign Up" onPress={handleSignUp} />

      {/* Link to navigate back to the login screen */}
      <Link href="/login" style={{ marginTop: 16 }}>
        <Text style={{ color: "blue" }}>Back to Login</Text>
      </Link>
    </View>
  );
}
