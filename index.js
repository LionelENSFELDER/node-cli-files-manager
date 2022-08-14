const fs = require('fs')
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
getFileList('./')


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
        name: 'getPath',
        message: "Enter path or keep empty for current folder :",
      },
    ])
    .then(answers => {
      // --- W A R N I N G ---
      // const workPath = answers.getPath === '' ? './' : answers.getPath
      const workPath = answers.getPath
      fs.readdir(workPath, (err, files) => {
        files.forEach((file, index) => {
          console.log(file);
          fs.rename(workPath + `/${file}`, workPath + `/${file}` + `${index}`, (err) => {
            if (err) throw err;
          })
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


