#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const figlet = require("figlet");
const { Command } = require("commander");
const fs = require("fs/promises");
const fse = require('fs');
const path = require("path");
const program = new Command();
console.log(figlet.textSync("Dir Manager"));
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .parse(process.argv);
const options = program.opts();
console.log(options);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
function listDirContents(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.readdir(filePath);
            const detailedFilesPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                let fileDetails = yield fs.lstat(path.resolve(filePath, file));
                const { size, birthtime } = fileDetails;
                return { filename: file, "size(KB)": size, created_at: birthtime };
            }));
            console.log(detailedFilesPromises);
            const detailedFiles = yield Promise.all(detailedFilesPromises);
            console.table(detailedFiles);
        }
        catch (err) {
            console.log(err, 'Error while listing Dir contents !!');
        }
    });
}
function createDir(filePath) {
    if (!fse.existsSync(filePath)) {
        fse.mkdirSync(filePath);
        console.log("The directory has been created successfully");
    }
}
function createFile(filePath) {
    fse.openSync(filePath, "w");
    console.log("An empty file has been created");
}
if (options.ls) {
    const filepath = typeof options.ls === "string" ? options.ls : __dirname;
    listDirContents(filepath);
}
if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
//# sourceMappingURL=index.js.map