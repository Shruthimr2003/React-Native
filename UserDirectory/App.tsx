import React, { useEffect, useMemo, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Header from "./src/components/Header";
import SearchBar from "./src/components/SearchBar";
import UserCard from "./src/components/UserCard";

import { useUserStore } from "./src/stores/useUserStore";
import { useUIStore } from "./src/stores/useUIStore";
import { useAuthStore } from "./src/stores/useAuthStore";

import { getSecure } from "./src/services/secureStorage";
import { useTheme } from "./src/themes/useTheme";
import { usePostStore } from "./src/stores/usePostStore";
import Footer from "./src/components/Footer";



export default function App() {

  /* ---------- stores ---------- */
  const colors = useTheme()
  const users = useUserStore(s => s.users);
  const favorites = useUserStore(s => s.favorites);
  const pinnedUserId = useUserStore(s => s.pinnedUserId);

  const fetchUsers = useUserStore(s => s.fetchUsers);
  const setPinnedUser = useUserStore(s => s.setPinnedUser);

  const searchQuery = useUIStore(s => s.searchQuery);

  const initializeAuth = useAuthStore(s => s.initialize);

  const clearUsers = useUserStore(s => s.clearUsers)
  const clearCache = usePostStore(s => s.clearCache)

 

  useEffect(() => {
    const init = async () => {

      await initializeAuth();
  
      const lastFetched = useUserStore.getState().lastFetched

      const FIVE_MINUTES = 5 * 60 * 1000

      if(!lastFetched || Date.now() -lastFetched > FIVE_MINUTES ){
        await fetchUsers()
      }

      const pinned = await getSecure("pinned_user_id");

      if (pinned) {
        setPinnedUser(Number(pinned));
      }
    };

    init();

  }, []);

  const handleRefresh = async () => {
    clearUsers()
    clearCache()
    await fetchUsers()
  }

  const sortedUsers = useMemo(() => {

    return [...users].sort((a, b) => {

      if (a.id === pinnedUserId) return -1;
      if (b.id === pinnedUserId) return 1;

      const aIsFav = favorites.includes(a.id);
      const bIsFav = favorites.includes(b.id);

      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;

      return 0;
    });

  }, [users, favorites, pinnedUserId]);


  const filteredUsers = useMemo(() => {

    if (!searchQuery) return sortedUsers;

    return sortedUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  }, [sortedUsers, searchQuery]);


  const renderItem = useCallback(
    ({ item }: any) => <UserCard userId={item.id} />,
    []
  );

  return (

    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <Header />

        <SearchBar />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onRefresh={handleRefresh}
          refreshing={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1 }}
          ListFooterComponent={Footer}
        />

      </KeyboardAvoidingView>

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
  }

});