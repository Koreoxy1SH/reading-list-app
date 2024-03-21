import React from "react"

export const useTheme = (storageKey = "vite-ui-theme") => {
	const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
		return localStorage.getItem(storageKey)
			? localStorage.getItem(storageKey) === "true"
			: window.matchMedia("(prefers-color-scheme:dark)").matches
	})

	React.useEffect(() => {
		const root = window.document.documentElement

		root.classList.remove("light", "dark")
		root.classList.add(isDarkMode ? "dark" : "light")
		localStorage.setItem(storageKey, isDarkMode.toString())
	}, [isDarkMode, storageKey])

	const toogleDarkMode = () => setIsDarkMode(!isDarkMode)

	// return {isDarkMode, toogleDarkMode}
	return { isDarkMode, toogleDarkMode }
}
