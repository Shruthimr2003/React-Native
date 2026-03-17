import React from "react";

import { useThemeStore } from "../stores/useThemeStore";
import { useUserStore } from "../stores/useUserStore";
import { useAuthStore } from "../stores/useAuthStore";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../themes/useTheme";

const Header = () => {

    const colors = useTheme()

    const users = useUserStore((s) => s.users);
    const favorites = useUserStore((s) => s.favorites);

    const token = useAuthStore((s) => s.token);

    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    return (
        <View style={styles.container}>

            <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]}>👥 User Directory</Text>

                {token && <Text style={styles.lock}>🔒</Text>}
            </View>

            <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                {users.length} users · {favorites.length} favorites
            </Text>

            <Pressable onPress={toggleTheme} style={styles.themeButton}>
                <Text style={styles.themeText}>
                    {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </Text>
            </Pressable>

        </View>
    );
};

export default Header

const styles = StyleSheet.create({

    container: {
        marginBottom: 16,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
    },

    lock: {
        fontSize: 18,
    },

    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
        marginBottom: 12,
    },

    themeButton: {
        alignSelf: "flex-start",
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    themeText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#3730A3",
    },

});