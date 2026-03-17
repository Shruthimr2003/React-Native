import * as SecureStore from "expo-secure-store";

export const saveSecure = async (key: string, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecure = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

export const deleteSecure = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};