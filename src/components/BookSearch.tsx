import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Book, useStore } from "@/store"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"
import * as React from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { GiBookPile } from "react-icons/gi"

export const BookSearch = () => {
	const { books, addBook } = useStore((state) => state)
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalResults, setTotalResults] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const resultsPerPage = 100

	type SearchResult = {
		docs: Book[]
		numFound: number
	}

	const searchBooks = async (page: number = 1) => {
		if (!query) return

		setIsLoading(true)
		try {
			const response = await axios.get<SearchResult>(
				`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`,
			)

			setResults(response.data.docs)
			setTotalResults(response.data.numFound)
			setCurrentPage(page)
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

	const handlePreviousClick = () => {
		if (currentPage > 1) {
			searchBooks(currentPage - 1)
		}
	}

	const handleNextClick = () => {
		if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
			searchBooks(currentPage + 1)
		}
	}

	const startIndex = (currentPage - 1) * resultsPerPage + 1
	const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults)

	const [open, setOpen] = React.useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")

	const SearchInput = (
		<div className="flex flex-col items-center gap-3 px-4 py-3 sm:flex-row">
			<div className="relative w-full sm:max-w-xs">
				<Input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for your next book!"
					onKeyUp={handleKeyPress}
				/>
			</div>
			<Button
				onClick={() => searchBooks()}
				disabled={isLoading}
				className="max-sm:w-full sm:max-w-xs"
			>
				{isLoading ? (
					<>
						<AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
						Searching...
					</>
				) : (
					"Search"
				)}
			</Button>
		</div>
	)

	const SearchResult = (
		<div className="[&::-webkit-scrollbar-thumb] :bg-gray-300 block max-h-[200px] overflow-y-auto sm:max-h-[300px] dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar]:w-2 [&::webkit-scrollbar-track]:bg-gray-100">
			{query.length > 0 && results.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tittle</TableHead>
							<TableHead>Author</TableHead>
							<TableHead className="hidden sm:table-cell">Year</TableHead>
							<TableHead className="hidden sm:table-cell">Page Count</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{results.map((book, index) => (
							<TableRow key={index}>
								<TableCell>{book.title}</TableCell>
								<TableCell>{book.author_name}</TableCell>
								<TableCell className="hidden sm:table-cell">
									{book.first_publish_year}
								</TableCell>
								<TableCell className="hidden sm:table-cell">
									{book.number_of_pages_median || "-"}
								</TableCell>
								<TableCell>
									<Button
										variant="secondary"
										onClick={() => {
											addBook({
												...book,
												status: "backlog",
											})
										}}
										disabled={books.some((b) => b.key === book.key)}
									>
										<GiBookPile className="size-5" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="flex max-h-60 items-center justify-center p-16">
					<p className="text-gray-600 dark:text-gray-400">
						Start your search !
					</p>
				</div>
			)}
		</div>
	)

	const SearchPagination = (
		<div className="flex w-full flex-col items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-between">
			<div>
				<p className="text-sm text-gray-600 dark:text-gray-600">
					{totalResults > 0 ? (
						<>
							Showing{" "}
							<span className="font-semibold text-gray-800 dark:text-gray-200">
								{startIndex} - {endIndex}
							</span>{" "}
							out of{" "}
							<span className="font-semibold text-gray-800 dark:text-gray-200">
								{totalResults}
							</span>{" "}
							results
						</>
					) : (
						"0 results"
					)}
				</p>
			</div>
			<div className="inline-flex gap-x-2">
				<Button
					variant="outline"
					onClick={handlePreviousClick}
					disabled={currentPage <= 1 || isLoading}
				>
					<SlArrowLeft className="size-4" />
				</Button>

				<Button
					variant="outline"
					onClick={handleNextClick}
					disabled={
						currentPage >= Math.ceil(totalResults / resultsPerPage) || isLoading
					}
				>
					<SlArrowRight className="size 4" />
				</Button>
			</div>
		</div>
	)

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">Add a new book</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Add a new book</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. click save when you're done.
						</DialogDescription>
						{SearchInput}
					</DialogHeader>
					{SearchResult}
					<DialogFooter>{SearchPagination}</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline">Add a new book</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Add a new book</DrawerTitle>
					<DrawerDescription>Search</DrawerDescription>
					{SearchInput}
				</DrawerHeader>
				{SearchResult}
				<DrawerFooter>{SearchPagination}</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
