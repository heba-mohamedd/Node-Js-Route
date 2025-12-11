const path = require("node:path");
const fs = require("node:fs");
const { EventEmitter } = require("node:events");
const os = require("node:os");
const event = new EventEmitter();

// 1. Write a function that logs the current file path and directory. (0.5 Grade)
// • Output Example:{File:“/home/user/project/index.js”, Dir:“/home/user/project”}
console.log({ file: __filename, Dir: __dirname });

// 2. Write a function that takes a file path and returns its file name. (0.5 Grade)
// • Input Example: /user/files/report.pdf
// • Output Example:"report.pdf"
console.log(path.basename(__filename)); //outPut : index.js
console.log(path.basename("/user/files/report.pdf")); //report.pdf

// 3. Write a function that builds a path from an object (0.5 Grade)
// • Input Example: { dir: "/folder", name: "app", ext: ".js"}
// • Output Example: “/folder/app.js”
console.log(path.format({ dir: "\\folder", name: "app", ext: ".js" })); // outPut : /folder/app.js

// 4. Write a function that returns the file extension from a given file path. (0.5 Grade)
// • Input Example: /docs/readme.md"
// • Output Example: “.md”
console.log(path.extname("/docs/readme.md")); //.md

// 5. Write a function that parses a given path and returns its name and ext. (0.5 Grade)
// • Input Example: /home/app/main.js
// • Output Example: { Name: “main”, Ext: “.js” }

console.log(path.parse("/home/app/main.js")); //OutPut : { root: '/', dir: '/home/app', base: 'main.js', ext: '.js', name: 'main' }
const { name, ext } = path.parse("/home/app/main.js");
console.log({ Name: name, Ext: ext }); //OutPut : { Name: “main”, Ext: “.js” }

// 6. Write a function that checks whether a given path is absolute. (0.5 Grade)
// • Input Example: /home/user/file.txt
// • Output Example: true
console.log(path.isAbsolute("/home/user/file.txt"));

// 7. Write a function that joins multiple segments (0.5 Grade)
// • Input:"src","components", "App.js"
// • Output Example: src/components/App.js
function joinSegments(...segments) {
  return path.join(...segments);
}
console.log(joinSegments("src", "components", "App.js"));
//console.log(path.join("src", "components", "App.js"));

// 8. Write a function that resolves a relative path to an absolute one. (0.5 Grade)
// • Input Example: ./index.js
// • Output Example: /home/user/project/src/index.js
console.log(path.resolve("./index.js"));

// 9. Write a function that joins two paths. (0.5 Grade)
// • Input Example: /folder1, folder2/file.txt
// • Output Example: /folder1/folder2/file.txt
console.log(path.join("/folder1", "folder2/file.txt"));

// 10. Write a function that deletes a file asynchronously. (0.5 Grade)
// • Input Example: /path/to/file.txt
// • Output Example: The file.txt is deleted.
let filePath = path.resolve("./file.txt");
// console.log(filePath);
if (fs.existsSync(filePath)) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    } else console.log("The file.txt is deleted");
  });
}

// 11. Write a function that creates a folder synchronously. (1 Grade)
// • Output Example: “Success”
function create_folder_sync() {
  fs.mkdirSync("src/users/admin", { recursive: true });
  return "Success";
}
console.log(create_folder_sync());

// 12. Create an event emitter that listens for a "start" event and logs a welcome message. (0.5 Grade)
// • Output Example: Welcome event triggered!
event.on("start", () => {
  console.log("Welcome event triggered!");
});

event.emit("start");

// 13. Emit a custom "login" event with a username parameter. (0.5 Grade)
// • Input Example:"Ahmed"
// • Output Example: “User logged in: Ahmed”
event.on("login", (name) => {
  console.log(`User logged in: ${name}`);
});
event.emit("login", "Heba");

// 14. Read a file synchronously and log its contents. (1 Grade)
// • Input Example:"./notes.txt"
// • Output Example: the file content => “This is a note.”
let data = fs.readFileSync(path.resolve("./notes.txt"), { encoding: "utf-8" });
console.log(data);

// 15. Write asynchronously to a file. (1 Grade)
// • Input: path:"./async.txt", content:"Async save"
fs.writeFile(path.resolve("./async.txt"), "Async save", (err) => {
  if (err) {
    console.log(err);
  }
});

// 16. Check if a directory exists. (0.5 Grade)
// • Input Example: "./notes.txt"
// • Output Example: true
console.log(fs.existsSync(path.resolve("./notes.txt")));

// 17. Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
// • Output Example: {Platform: “win32”, Arch: “x64”}

console.log({ Platform: os.platform(), Arch: os.arch() });
