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
currentFolder('./')


function currentFolder(path) {
  fs.readdir(path, (err, files) => {
    files.forEach(file => {
      filesList.push(file);
    });
    if (filesList.length > 0) {
      chooseAction()
    }
  });
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
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'getPath',
              message: "Enter work folder:",
            },
          ])
          .then(answers => {
            fs.readdir(answers.getPath, (err, files) => {
              files.forEach((file, index) => {
                console.log(file);
                // add regex for keep files extensions
                // delete old name
                fs.rename(answers.getPath + `/${file}`, answers.getPath + `/${file}` + `${index}`, (err) => {
                  if (err) throw err;
                })
              })
            })
          })
      }
    });
}


