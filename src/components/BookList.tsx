import React from "react"
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, useStore } from "@/store"
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./StrictModeDroppable"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {
	GiBookPile,
	GiBookmarklet,
	GiBookshelf,
	GiBurningBook,
} from "react-icons/gi"

export const BookList = () => {
	const { books, removeBook, moveBook, reorderBooks } = useStore(
		(state) => state,
	)

	const moveToList = (book: Book, targetList: Book["status"]) => {
		moveBook(book, targetList)
	}
	const renderBookItem = (
		book: Book,
		index: number,
		listType: Book["status"],
	) => (
		<Card
			key={index}
			className="rounded-none first:mt-0 first:rounded-t-lg last:rounded-b-lg"
		>
			<CardHeader>
				<CardTitle>{book.title}</CardTitle>
				<CardDescription>{book.author_name}</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-between">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="destructive" onClick={() => removeBook(book)}>
							<GiBurningBook className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Delete from my reading list</TooltipContent>
				</Tooltip>

				<div className="inline-flex gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								onClick={() => moveToList(book, "inProgress")}
								disabled={listType === "inProgress"}
							>
								<GiBookmarklet className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Mark as "Currently Reading"</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								onClick={() => moveToList(book, "backlog")}
								disabled={listType === "backlog"}
							>
								<GiBookPile className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Mark as "For Later"</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								onClick={() => moveToList(book, "done")}
								disabled={listType === "done"}
							>
								<GiBookshelf className="size-5 pb-0.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Mark as "Done"</TooltipContent>
					</Tooltip>
				</div>
			</CardFooter>
		</Card>
	)

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return
		const sourceIndex = result.source.index
		const destinationIndex = result.destination.index
		const listType = result.source.droppableId as Book["status"]

		reorderBooks(listType, sourceIndex, destinationIndex)
	}

	const renderDraggableBookList = (listType: Book["status"]) => {
		const filteredBooks = books.filter((book) => book.status === listType)

		return (
			<StrictModeDroppable droppableId={listType}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{filteredBooks.map((book, index) => (
							<Draggable key={book.key} draggableId={book.key} index={index}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										className="my-2"
									>
										<div {...provided.dragHandleProps}>
											{renderBookItem(book, index, listType)}
										</div>
									</div>
								)}
							</Draggable>
						))}
					</div>
				)}
			</StrictModeDroppable>
		)
	}

	return (
		<div className="space-y-8 p-4">
			<h2 className="mb-4 text-2xl font-bold">Reading List</h2>

			<DragDropContext onDragEnd={onDragEnd}>
				{books.filter((book) => book.status === "inProgress").length > 0 && (
					<>
						<h3 className="my-2 flex items-end gap-2 text-xl font-semibold dark:text-white">
							Currently Reading
							<GiBookmarklet className="size-6" />
						</h3>
						{renderDraggableBookList("inProgress")}
					</>
				)}
			</DragDropContext>

			<DragDropContext onDragEnd={onDragEnd}>
				{books.filter((book) => book.status === "backlog").length > 0 && (
					<>
						<h3 className="my-2 flex items-end gap-2 text-xl font-semibold dark:text-white">
							For Later <GiBookPile className="size-7" />
						</h3>
						{renderDraggableBookList("backlog")}
					</>
				)}
			</DragDropContext>

			{books.filter((book) => book.status === "done").length > 0 && (
				<>
					<h3 className="my-2 flex items-end gap-2 text-xl font-semibold dark:text-white">
						Done
						<GiBookshelf className="size-7 pb-0.5" />
					</h3>
					<div>
						{books
							.filter((book) => book.status === "done")
							.map((book, index) => renderBookItem(book, index, "done"))}
					</div>
				</>
			)}
		</div>
	)
}
