import * as fs from 'fs'
import * as readline from 'node:readline'
import * as path from 'path'
import { argv } from 'node:process'
import * as chalk from 'chalk'
import * as inquirer from 'chalk'

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var filesList = [];

function removeDuplicates(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

function listExtensionsInFolder(dir) {
  const extensionsInFolder = []
  console.log(dir)
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      let extension = path.extname(`${dir}/${file}`)
      extensionsInFolder.push(extension)
    })
    const curatedExtensions = removeDuplicates(extensionsInFolder)
    return curatedExtensions
  })
}

function listMimeTypeInFolder(dir) {
  const extensionsInFolder = []
  console.log(dir)
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      let extension = path.type
      extensionsInFolder.push(extension)
    })
    const curatedExtensions = removeDuplicates(extensionsInFolder)
    return curatedExtensions
  })
}

function getFileList(path) {
  fs.readdir(path, (err, files) => {
    files.forEach(file => {
      filesList.push(file);
    });
    if (filesList.length > 0) {
      chooseAction()
    }
  });
}

function renameFiles() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'path',
        message: "Path (keep empty = current)",
      },
      {
        type: 'input',
        name: 'fileExtension',
        message: "File extension to process ",
      },
      {
        type: 'input',
        name: 'newName',
        message: "New name for all files.",
      },
    ])
    .then(answers => {
      // --- W A R N I N G ---
      // const workPath = answers.path === '' ? './' : answers.path
      const workPath = answers.path
      fs.readdir(workPath, (err, files) => {
        files.forEach((file, index) => {
          const extensionToProcess = answers.fileExtension
          const extension = file.match(/.[0-9a-z]+$/i)[0]
          const newName = answers.newName
          const oldFilePath = workPath + `/${file}`
          const newFilePath = workPath + `/${newName}` + `${index}` + `${extension}`
          if (extensionToProcess === extension) {
            fs.rename(oldFilePath, newFilePath, (err) => {
              console.log(
                chalk.yellow.bold(file), 'has renamed to', chalk.yellow.bold(`${newName}` + `${index}` + `${extension}`)
              )
              if (err) throw err;
            })
          } else {
            console.log(
              chalk.white(file)
            )
          }
        })
      })
    })
}

function isExtensionValid(file) {
  if (path.extname(file) === '.' || path.extname(file) === '') {
    return false
  }
  return true
}

function renameFile(file, newName = 'fs') {
  console.log('file ', file, ' is renamed !')
}

function getFilesList(type, currentPath = process.cwd()) {
  const filesToProcess = []
  if (type === 'byExtension') {
    fs.readdir(currentPath, (err, files) => {
      files.forEach((file, index) => {
        if (isExtensionValid(file)) {
          if (path.extname(file) === argv[4]) {
            console.log(file)
            renameFile(file)
          }
        }
      })
    })
  }
}

function getAction(arg) {
  console.log('getAction:', arg)
  switch (arg) {
    case '-re':
      if (argv[2]) {
        getFilesList('byExtension');
      }
      break;
    default:
      console.log(`Sorry, we are out of ${arg}.`);
  }
}

function getArgv() {
  console.log('dirname :')
  console.log(argv[2])
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });
  getAction(argv[2])
  console.log("Current directory:", process.cwd());
}
getArgv()
