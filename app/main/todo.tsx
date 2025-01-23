import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/app/AuthContext";
import { signOut } from "@/src/auth";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../../src/todo";

interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  user_id: string;
}

export default function TodoScreen() {
  const router = useRouter();

  // Retrieved from useAuth():
  //  - session: Information about the login session
  //  - isLoading: True while initially loading session data from AsyncStorage
  const { session, isLoading } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Edit mode state
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  /**
   * 1) Check for session existence
   * - If the app has finished loading (isLoading is false) but there is no session, redirect to the login page (/auth/login)
   */
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/auth/login");
    }
  }, [isLoading, session]);

  /**
   * 2) Fetch the Todo list if a session exists
   * - Call fetchTodos() only when the session is valid
   * - Fetch once initially, then re-fetch on button click or after creating a new Todo
   */

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session]);

  // --- Fetching the Todo list ---
  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data || []);
    } catch (error) {
      console.error(error);
      alert(`Failed to fetch todos: ${error}`);
    }
  };

  // --- Create To do ---
  const handleCreateTodo = async () => {
    try {
      if (!title.trim()) {
        alert("Title is a required field.");
        return;
      }
      await createTodo(title, description, dueDate);
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchTodos(); // Reload the list after creation
    } catch (error) {
      console.error(error);
      alert(`Failed to create todo: ${error}`);
    }
  };

  // --- Delete To do ---
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error(error);
      alert(`Failed to delete todo: ${error}`);
    }
  };

  // Confirmation Alert before deletion
  const handleDeleteConfirm = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteTodo(id),
        },
      ]
    );
  };

  // --- Update To do ---
  const handleEditPress = (todo: Todo) => {
    // When entering edit mode, save the existing values to the state
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditDueDate(todo.due_date);
  };

  const handleUpdateTodo = async () => {
    if (!editingTodo) return;

    try {
      await updateTodo(editingTodo.id, {
        title: editTitle,
        description: editDescription,
        due_date: editDueDate,
      });
      // Exit edit mode and refresh the list after the update
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error(error);
      alert(`Failed to update todo: ${error}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
  };

  // --- Logout ---
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error(error);
      alert("Logout error: " + error);
    }
  };

  /**
   * Function to render a single Todo item (for use with FlatList)
   */

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View
      style={{
        padding: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 4,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Due: {item.due_date}</Text>
      <Text>Completed: {item.completed ? "Yes" : "No"}</Text>

      <View style={{ flexDirection: "row", marginTop: 4 }}>
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => handleEditPress(item)}
        >
          <Text style={{ color: "blue" }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDeleteConfirm(item.id)}>
          <Text style={{ color: "red" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Edit Form visible only in edit mode
   */

  const renderEditForm = () => {
    if (!editingTodo) return null;

    return (
      <View style={{ marginTop: 20, padding: 16, borderWidth: 1 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Edit Todo</Text>

        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Title"
          value={editTitle}
          onChangeText={setEditTitle}
        />
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Description"
          value={editDescription}
          onChangeText={setEditDescription}
        />
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Due Date (YYYY-MM-DD)"
          value={editDueDate}
          onChangeText={setEditDueDate}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Save" onPress={handleUpdateTodo} />
          <Button title="Cancel" onPress={handleCancelEdit} color="red" />
        </View>
      </View>
    );
  };

  /**
   * Screen rendering
   */
  // (1) Show a loading indicator while the global session is loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // (2) If there is no session, the user is already being redirected to /auth/login by useEffect().
  //     Temporarily return null here.
  if (!session) {
    return null;
  }

  // (3) If a session exists and loading is complete, render the main content
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
          <Text style={{ color: "blue" }}>Logout</Text>
        </TouchableOpacity>

        <Link href="/auth/update-user">
          <Text style={{ color: "blue" }}>Update User</Text>
        </Link>
      </View>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 16 }}>
        My Todos
      </Text>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodoItem}
      />

      {/* Section for creating a new Todo */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Create New Todo</Text>
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
          placeholder="Due Date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <Button title="Add Todo" onPress={handleCreateTodo} />
      </View>

      {/* Edit Form */}
      {renderEditForm()}
    </View>
  );
}
