import { TextInput, StyleSheet } from "react-native";

import { useUIStore } from "../stores/useUIStore";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../themes/useTheme";


export const SearchBar = () => {

    const colors = useTheme()
    const searchQuery = useUIStore(s => s.searchQuery)
    const setSearchQuery = useUIStore(s => s.setSearchQuery)

    const [value, setaValue] = useState("") // local state

    const timeoutRef = useRef<NodeJS.Timeout | null>(null) // debounce timer

    //  keep local state synced if store changes 
    useEffect(() => {
        setaValue(searchQuery)
    }, [searchQuery])

    const handleChange = (text: string) => {

        setaValue(text)// instant Ui updates

        // clear previous timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // set new debounce timer
        timeoutRef.current = setTimeout(() => {
            setSearchQuery(text)
        }, 300)

    };

    return (
        <TextInput
            placeholder="🔍 Search users..."
            placeholderTextColor={colors.placeholder}
            value={value}
            onChangeText={handleChange}
            style={[styles.input, {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text
            }]}>
        </TextInput>
    )

}

export default SearchBar

const styles = StyleSheet.create({

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 15,
        marginBottom: 16,
    },

});