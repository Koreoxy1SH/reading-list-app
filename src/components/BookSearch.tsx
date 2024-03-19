import axios from "axios"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const BookSearch = () => {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)

	type SearchResult = {
		docs: any[]
		numFound: number
	}

	const searchBooks = async () => {
		if (!query) return

		setIsLoading(true)
		try {
			const response = await axios.get<SearchResult>(
				`https://openlibrary.org/search.json?q=${query}`,
			)

			setResults(response.data.docs)
		} catch (error) {
			console.error("Error fetching OpenLibrary API data", error)
		}
		setIsLoading(false)
	}

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			searchBooks()
		}
	}

	return (
		<div className="p-4">
			<div className="sm:max-w-xs">
				<Input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for your next book!"
					onKeyUp={handleKeyPress}
				/>
			</div>
			<Button onClick={() => searchBooks()} disabled={isLoading}>
				{isLoading ? "Searching..." : "Search"}
			</Button>

			<div className="mt-4 max-h-64 overflow-auto">
				<ul>
					{results.map((book, index) => (
						<li key={index}>{JSON.stringify(book, null, 2)}</li>
					))}
				</ul>
			</div>
		</div>
	)
}
