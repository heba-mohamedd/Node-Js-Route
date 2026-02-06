import { Router } from "express";
import * as NS from "./note.service.js";
import { auth } from "../../middleware/auth.js";
const noteRouter = Router();

noteRouter.post("/", auth, NS.CreateNote);
noteRouter.patch("/all", auth, NS.UpdataTitleOfAllNotes);
// noteRouter.patch("/:noteId", auth, NS.UpdataNote);
noteRouter.put("/replace/:noteId", auth, NS.ReplaceNote);
// noteRouter.delete("/:noteId", auth, NS.DeleteSingleNote);
noteRouter.get("/paginate-sort", auth, NS.GetPaginateNotes);
// noteRouter.get("/:noteId", auth, NS.GetNoteById);
noteRouter.get("/note-by-content", auth, NS.GetNoteByContent);
noteRouter.get("/note-with-user", auth, NS.GetAllNotesWithUserInformation);
noteRouter.get("/aggregate", auth, NS.GetAllNotesByAggregation);
noteRouter.delete("/", auth, NS.DeleteAllNoteForUser);

export default noteRouter;
