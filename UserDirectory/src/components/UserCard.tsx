
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";

import { useUserStore } from "../stores/useUserStore";
import { usePostStore } from "../stores/usePostStore";
import { useUIStore } from "../stores/useUIStore";
import { useTheme } from "../themes/useTheme";
import { useShallow } from "zustand/react/shallow";

import { saveSecure, deleteSecure } from "../services/secureStorage";
import React from "react";

type Props = {
    userId: number;
}

const UserCard = ({ userId }: Props) => {

    // console.log("Rendering UserCard:", userId);

    const colors = useTheme()


    const user = useUserStore(
        s => s.users.find(u => u.id === userId)
    )

    const isFavorite = useUserStore(
        s => s.favorites.includes(userId)
    )

    const isPinned = useUserStore(
        s => s.pinnedUserId === userId
    )

    const toggleFavorite = useUserStore(
        s => s.toggleFavorite
    )

    const setPinnedUserId = useUserStore(
        s => s.setPinnedUser
    )

    const expanded = useUIStore(
        s => s.expandedUserId === userId
    )

    React.useEffect(() => {
        console.log("Expanded changed:", userId, expanded);
    }, [expanded]);

    const setExpandedUserId = useUIStore(
        s => s.setExpandedUserId
    )

    const posts = usePostStore(
        s => s.byUserId[userId]
    )

    const isLoadingPosts = usePostStore(
        s => s.loadingForUser === userId
    )

    const fetchPosts = usePostStore(
        s => s.fetchPosts
    )

    const handlePress = () => {
        const newExpanded = expanded ? null : userId;

        setExpandedUserId(newExpanded)

        if (!posts && newExpanded) {
            fetchPosts(userId)
        }
    }

    const handleFavorite = () => {
        toggleFavorite(userId)
    }

    const handlePin = async () => {
        if (isPinned) {
            setPinnedUserId(null)
            await deleteSecure("pinned_user_id")
        }
        else {
            setPinnedUserId(userId)
            await saveSecure("pinned_user_id", String(userId))
        }
    };

    if (!user) return null;

    return (
        <Pressable
            onPress={handlePress}
            onLongPress={handlePin}
            style={[styles.card, { backgroundColor: colors.card }]}
        >

            <View style={styles.row}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <Pressable onPress={handleFavorite}>
                    <Text
                        style={[
                            styles.favorite,
                            { color: isFavorite ? "#FACC15" : colors.text }
                        ]}
                    >
                        {isFavorite ? "⭐" : "☆"}
                    </Text>
                </Pressable>

                <Text style={[styles.name, { color: colors.text }]}>
                    {isPinned && "📌 "} {user.name}
                </Text>

                <Text style={styles.expandIcon}>
                    {expanded ? "▾" : "▸"}
                </Text>


            </View>

            <Text style={[styles.company, { color: colors.subtitle }]}>
                {user.company.name}
            </Text>

            {expanded && (
                <View style={styles.postsContainer}>

                    {isLoadingPosts && (
                        <ActivityIndicator size="small" />
                    )}

                    {posts?.map(post => (
                        <Text key={post.id} style={[styles.post, { color: colors.text }]}>• {post.title} </Text>
                    ))}

                </View>
            )}

        </Pressable>
    );
};

export default React.memo(UserCard);



const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        backgroundColor: "#6366F1",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        borderRadius: 50,
        height: 30,
        width: 30
    },


    avatarText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700"
    },

    name: {
        flex: 1,
        fontWeight: "600",
        fontSize: 16,
        color: "#111827",
    },

    favorite: {
        fontSize: 18,
    },

    company: {
        color: "#6B7280",
        marginTop: 4,
        fontSize: 14,
    },

    postsContainer: {
        marginTop: 10,
    },

    post: {
        fontSize: 13,
        color: "#374151",
        marginTop: 4,
    },
    expandIcon: {
        fontSize: 25,
        color: "#6B7280",
    }

});