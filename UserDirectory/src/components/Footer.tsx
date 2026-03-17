import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useThemeStore } from "../stores/useThemeStore";
import { useTheme } from "../themes/useTheme";

const Footer = () => {
  const colors = useTheme();
  const theme = useThemeStore((s) => s.theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.subtitle }]}>
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"} · Platform: {Platform.OS}
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    marginTop: "auto",
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
  },
});