const fs = require('fs')
// const path = require(path)
const chalk = require('chalk')
const inquirer = require('inquirer');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(
  chalk.yellow('File Manager')
)

var filesList = [];
// getFileList('./')


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

function chooseAction() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose action',
        choices: ['Rename', 'Delete']
      },
    ])
    .then(answers => {
      if (answers.action === 'Rename') {
        renameFiles()
      }
    });
}

chooseAction()
