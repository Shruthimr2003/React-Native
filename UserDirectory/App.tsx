import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context'

type User = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};

type Post = {
  id: number;
  title: string;
  userId: number;
};

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

export default function App() {

  const { width, height } = useWindowDimensions();
  const avatarSize = width * 0.12;

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [postsByUser, setPostsByUser] = useState<Record<number, Post[]>>({});
  const [loadingPosts, setLoadingPosts] = useState<Record<number, boolean>>({});

  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");



  const fetchUsers = async () => {
    try {
      setError(null);
      setLoadingUsers(true);

      const response = await api.get<User[]>("/users");

      setUsers(response.data);
      setFilteredUsers(response.data);

    } catch {
      setError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };


  const fetchPosts = async (userId: number) => {

    try {
      setLoadingPosts(prev => ({ ...prev, [userId]: true }));

      const res = await api.get<Post[]>(`/posts?userId=${userId}`);

      setPostsByUser(prev => ({
        ...prev,
        [userId]: res.data
      }));

    } finally {
      setLoadingPosts(prev => ({ ...prev, [userId]: false }));
    }
  };

  const toggleUser = (userId: number) => {

    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    if (!postsByUser[userId]) {
      fetchPosts(userId);
    }
  };

  const handleSearch = (text: string) => {

    setSearch(text);

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const onRefresh = async () => {

    setRefreshing(true);

    setPostsByUser({});
    setExpandedUserId(null);

    await fetchUsers();

    setRefreshing(false);
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const renderItem = useCallback(({ item }: { item: User }) => {

    const expanded = expandedUserId === item.id;
    const posts = postsByUser[item.id];
    const loading = loadingPosts[item.id];

    return (

      <Pressable
        onPress={() => toggleUser(item.id)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
      >

        <View style={styles.row}>

          <View
            style={[
              styles.avatar,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }
            ]}
          >
            <Text style={styles.avatarText}>
              {item.name.charAt(0)}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.company}>{item.company.name}</Text>
          </View>

          <View style={styles.badge}>
            <Text>{Platform.OS === "ios" ? "iOS" : "Android"}</Text>
          </View>

          <Text style={styles.arrow}>
            {expanded ? "▾" : "▸"}
          </Text>

        </View>

        {expanded && (

          <View style={styles.postsContainer}>

            {loading && <ActivityIndicator size="small" />}

            {posts?.slice(0, 3).map(post => (
              <Text key={post.id} style={styles.postTitle}>
                * {post.title}
              </Text>
            ))}

          </View>

        )}

      </Pressable>

    );

  }, [expandedUserId, postsByUser, loadingPosts, avatarSize]);



  if (loadingUsers) {

    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }


  if (error) {

    return (
      <SafeAreaView style={styles.center}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={fetchUsers} />
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.safe}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardDismissMode="on-drag"

          ItemSeparatorComponent={() => <View style={styles.separator} />}

          ListHeaderComponent={() => (

            <View>
              <Text style={styles.title}>👥User Directory</Text>
              <Text style={styles.subtitle}>{filteredUsers.length} users loaded</Text>
              <TextInput
                placeholder="Search users..."
                value={search}
                onChangeText={handleSearch}
                style={styles.search}
              />
            </View>

          )}

          ListEmptyComponent={() => (
            <Text style={styles.empty}>No users found</Text>
          )}

          ListFooterComponent={() => (
            <Text style={styles.footer}>
              Platform: {Platform.OS} | {Math.round(width)}x{Math.round(height)}
            </Text>
          )}

        />

      </KeyboardAvoidingView>

      <StatusBar style="dark" />

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  container: {
    flex: 1,
    paddingHorizontal: 16
  },

  /* ---------- header ---------- */

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16
  },

  /* ---------- search ---------- */

  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    marginBottom: 18
  },

  /* ---------- card ---------- */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 }
      },
      android: {
        elevation: 3
      }
    })
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }]
  },

  row: {
    flexDirection: "row",
    alignItems: "center"
  },


  avatar: {
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },

  /* ---------- user info ---------- */

  userInfo: {
    flex: 1
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827"
  },

  company: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2
  },

  /* ---------- badge ---------- */

  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10
  },

  /* ---------- arrow ---------- */

  arrow: {
    fontSize: 18,
    color: "#6B7280"
  },

  /* ---------- posts ---------- */

  postsContainer: {
    marginTop: 12,
    paddingLeft: 48,
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    paddingTop: 10
  },

  postTitle: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 18
  },

  /* ---------- list ---------- */

  separator: {
    height: 12
  },

  empty: {
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
    marginTop: 40
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  footer: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 12,
    color: "#9CA3AF"
  }

});