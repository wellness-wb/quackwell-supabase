import { supabase } from "@/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../AuthContext";

export default function UpdateUserScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { session, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/auth/login");
    }
  }, [isLoading, session]);

  const handleUpdateUser = async () => {
    if (!session) {
      Alert.alert("Error", "You must be logged in to update your information.");
      return;
    }

    if (!email || !password) {
      Alert.alert(
        "Validation Error",
        "Please fill in both email and password."
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", "User updated successfully");
      console.log("Updated User Data:", data);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Update Error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update User</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Update" onPress={handleUpdateUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
