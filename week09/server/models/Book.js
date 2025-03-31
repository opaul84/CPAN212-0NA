import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        author: {
            type: String,
            require: true
        },
        publisher: {
            type: String,
            require: true
        },
        pages: {
            type: Number,
            require: true
        },
        releaseDate: {
            type: String,
            require: true
        },
        ISBN: {
            type: String,
            require: true
        },
        },
)

const Book = mongoose.model("books", bookSchema);
export default Book;