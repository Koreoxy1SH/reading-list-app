import { useEffect } from "react"
import { BookSearch } from "./components/BookSearch"
import { BookList } from "./components/BookList"
import { useStore } from "./store"
import { Layout } from "./components/Layout"

const App = () => {
	const { loadBooksFromLocalStorage } = useStore((state) => state)

	useEffect(() => {
		loadBooksFromLocalStorage()
	}, [loadBooksFromLocalStorage])

	return (
		<Layout>
			<BookSearch />
			<BookList />
		</Layout>
	)
}

export default App
