import { useThemeStore } from "../stores/useThemeStore"
import { lightTheme, darkTheme } from "./colors"

export const useTheme = () => {

  const theme = useThemeStore(s => s.theme)

  const colors = theme === "light"
    ? lightTheme
    : darkTheme

  return colors
}