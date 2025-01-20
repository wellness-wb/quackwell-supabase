// app/loginScreen.tsx
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { signIn } from "../src/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Navigate to the /todo screen upon successful login
      router.push("/todo");
    } catch (error) {
      console.error(error);
      alert(`Login failed: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />

      {/* Link to navigate to the password recovery (reset) screen */}
      <Link href="/forgot-password" style={{ marginTop: 16 }}>
        <Text style={{ color: "blue" }}>Forgot password?</Text>
      </Link>

      {/* Link to navigate to the sign-up page */}
      <Link href="/signup" style={{ marginTop: 16 }}>
        <Text style={{ color: "blue" }}>Don't have an account? Sign up</Text>
      </Link>
    </View>
  );
}
