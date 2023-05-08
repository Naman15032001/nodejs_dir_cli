#! /usr/bin/env node

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

async function listDirContents(filePath: string) {

    try {
        const files = await fs.readdir(filePath);
        const detailedFilesPromises = files.map(async (file: string) => {
            let fileDetails = await fs.lstat(path.resolve(filePath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        console.log(detailedFilesPromises);
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (err) {
        console.log(err, 'Error while listing Dir contents !!')
    }
}

function createDir(filePath: string) {
    if (!fse.existsSync(filePath)) {
        fse.mkdirSync(filePath);
        console.log("The directory has been created successfully");
    }
}

function createFile(filePath: string) {
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