import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Welcome to QuackWell
      </Text>

      <Text style={{ marginBottom: 16 }}>This is the main (landing) page.</Text>

      {/* Go to login page */}
      <View style={{ marginBottom: 12 }}>
        <Button title="Go to Login" onPress={() => router.push("/login")} />
      </View>

      {/* Go to sign up page */}
      <View style={{ marginBottom: 12 }}>
        <Button title="Sign Up" onPress={() => router.push("/signup")} />
      </View>
    </View>
  );
}
