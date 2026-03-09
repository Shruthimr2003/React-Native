import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity
} from "react-native";

export default function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emoji, setEmoji] = useState("😀");

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {

    if (username === "admin" && password === "1234") {
      setEmoji("🎉");
    } else {
      setEmoji("😡");

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true })
      ]).start();
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.emoji}>{emoji}</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>

        <TextInput
          placeholder="Username"
          style={styles.input}
          onFocus={() => setEmoji("👀")}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          onFocus={() => setEmoji("🙈")}
          value={password}
          onChangeText={setPassword}
        />

      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2"
  },

  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },

  input: {
    width: 250,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white"
  },

  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }


});

