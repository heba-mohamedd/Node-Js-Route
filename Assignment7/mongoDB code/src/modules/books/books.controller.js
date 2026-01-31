import { Router } from "express";
import * as BS from "./books.service.js";

const bookRouter = Router();

bookRouter.post("/", BS.insertBook);
bookRouter.post("/batch", BS.insertMultipleBooks);
bookRouter.patch("/:title", BS.updataBook);
bookRouter.get("/title", BS.getBookWithTitle);
bookRouter.get("/year", BS.getBooksWithYear);
bookRouter.get("/genre", BS.getBookByGenre);
bookRouter.get("/skip-limit", BS.getSkipAndLimitBooks);
bookRouter.get("/year-integer", BS.getBooksWithYearIsInteger);
bookRouter.get("/exclude-genres", BS.getBooksWithExcludegenres);
bookRouter.delete("/before-year", BS.DeleteAllBooksBeforeYear);
bookRouter.get("/aggregate1", BS.getFilteredAndSortedBooks);
bookRouter.get("/aggregate2", BS.getBooksPublishedAfter2000);
bookRouter.get("/aggregate3", BS.splitGenres);
bookRouter.get("/aggregate4", BS.getBooksWithLogs);

export default bookRouter;
