const fs = require("node:fs");
const { resolve } = require("node:path");
const { createGzip, createGunzip } = require("node:zlib");
const gzip = createGzip();

// Part1: Core Modules
// 1. Use a readable stream to read a file in chunks and log each chunk.
// • Input Example: "./big.txt"
// • Output Example: log each chunk
const readFileStream_1 = fs.createReadStream(resolve("./big.txt"), {
  encoding: "utf-8",
  highWaterMark: 100,
});
readFileStream_1.on("data", (chunk) => {
  console.log("----------Data----------");
  console.log(chunk);
});

// 2. Use readable and writable streams to copy content from one file to another.
// • Input Example: "./source.txt", "./dest.txt"
// • Output Example: File copied using streams
const readFileStream_2 = fs.createReadStream(resolve("./source.txt"), {
  encoding: "utf-8",
  highWaterMark: 100,
});
const writeFileStream_2 = fs.createWriteStream(resolve("./dest.txt"));
readFileStream_2.on("data", (chunk) => {
  writeFileStream_2.write(chunk);
});

// 3. Create a pipeline that reads a file, compresses it, and writes it to another file.
// • Input Example: "./data.txt", "./data.txt.gz"
const readFileStream_3 = fs.createReadStream(resolve("./data.txt"), {
  encoding: "utf-8",
});
const writeFileStream_3 = fs.createWriteStream(resolve("./data.txt.gz"));
readFileStream_3.pipe(gzip).pipe(writeFileStream_3);

// const stream = require("node:stream/promises");
// stream.pipeline(readFileStream_3, gzip, writeFileStream_3);
