import { create } from "zustand"

export type Book = {
	key: string
	title: string
	author_name: string[]
	first_publish_year: number
	number_of_pages_median: number | null
	status: "done" | "inProgress" | "backlog"
}

interface BookState {
	books: Book[]
}

interface BookStore extends BookState {
	addBook: (newBook: Book) => void
	removeBook: (bookToRemove: Book) => void
	moveBook: (bookToMove: Book, newStatus: Book["status"]) => void
	loadBooksFromLocalStorage: () => void
	reorderBooks: (
		listType: Book["status"],
		startIndex: number,
		endIndex: number,
	) => void
}

const initialBooks: Book[] = [
	{
		key: "/works/OL9476843M",
		title: "The Lord of the Rings 2007 Calendar",
		author_name: ["John kan"],
		first_publish_year: 122,
		number_of_pages_median: 2131,
		status: "inProgress",
	},
	{
		key: "/works/OL9asdaasd",
		title: "The Broke",
		author_name: ["dEDD kan"],
		first_publish_year: 111,
		number_of_pages_median: 2121,
		status: "backlog",
	},
	{
		key: "/works/Oa1231asd",
		title: "The Dude",
		author_name: ["dude"],
		first_publish_year: 134,
		number_of_pages_median: 125,
		status: "done",
	},
]

export const useStore = create<BookStore>((set) => ({
	books: [],

	addBook: (newBook) =>
		set((state: BookState) => {
			const updatedBooks: Book[] = [
				...state.books,
				{ ...newBook, status: "backlog" },
			]

			localStorage.setItem("readingList", JSON.stringify(updatedBooks))
			return { books: updatedBooks }
		}),

	removeBook: (bookToRemove) =>
		set((state: BookState) => {
			if (window.confirm("Are you sure you want to remove this book?")) {
				const updatedBooks = state.books.filter(
					(book) => book.key !== bookToRemove.key,
				)
				localStorage.setItem("readingList", JSON.stringify(updatedBooks))
				return { books: updatedBooks }
			}
			return state
		}),

	moveBook: (bookToMove, newStatus) =>
		set((state: BookState) => {
			const updatedBooks: Book[] = state.books.map((book) =>
				book.key === bookToMove.key ? { ...book, status: newStatus } : book,
			)

			localStorage.setItem("readingList", JSON.stringify(updatedBooks))
			return { books: updatedBooks }
		}),
	reorderBooks: (
		listType: Book["status"],
		startIndex: number,
		endIndex: number,
	) =>
		set((state: BookState) => {
			const filteredBooks = state.books.filter(
				(book) => book.status === listType,
			)

			const [reorderedBook] = filteredBooks.splice(startIndex, 1)

			filteredBooks.splice(endIndex, 0, reorderedBook)

			const updatedBooks = state.books.map((book) =>
				book.status === listType ? filteredBooks.shift() || book : book,
			)

			localStorage.setItem("readingList", JSON.stringify(updatedBooks))
			return { books: updatedBooks }
		}),

	loadBooksFromLocalStorage: () => {
		const storedBooks = localStorage.getItem("readingList")
		if (storedBooks) {
			set({ books: JSON.parse(storedBooks) })
		} else {
			set({ books: initialBooks })
		}
	},
}))
