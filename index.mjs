import * as fs from 'node:fs'
import * as readline from 'node:readline'
import * as path from 'path'
import { argv, cwd } from 'node:process'
import process from 'node:process'

// TODO : gather globals in one place 
const workDir = process.cwd()
var filesList = [];
var userArgv = {}

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

function isExtensionValid(file) {
  if (path.extname(file) === '.' || path.extname(file) === '') {
    return false
  }
  return true
}

function isArgvValid(argv) {
  argv.forEach((val, index) => {
    if (typeof val !== 'string') {
      throw new Error('one or more arguments is note a string');
    }
  });
}

function renameFile(file, newName = 'fs_') {
  console.log('file ', file, ' is renamed !')
}

function getFilesList() {
  const filesInWorkDir = [];
  fs.readdir(workDir, (err, files) => {
    if (err) {
      console.log('error in getFilesList');
    } else {
      files.forEach((file) => {
        filesInWorkDir.push(file)
      })
      filesList.push(...filesInWorkDir)
      console.log('filesList', filesList)
    }
  })
}

const returnFlag = (flag) => {
  let value = undefined;
  argv.forEach((val, index) => {
    if (val.includes(flag)) {
      value = val.split('=').pop()
    }
  })
  return value;
}

function deleteFiles() {
  if (!filesList.length) {
    console.log('there is no files in folder !')
  }
  switch (userArgv.filter) {
    case 'extension':
      console.log('delete files by extension');
      break;
    case 'name':
      console.log('delete files by name');
      break;
    default:
      console.log('delete files by default (extension)')
  }

}

function createProcess(action, filter = 'undefined') {
  switch (action) {
    case 'move':
      break;
    case 'rename':
      break;
    case 'delete':
      deleteFiles()
      break;
    default:
      console.log('action undefined !')
  }
}

function getArgv() {
  userArgv.action = returnFlag('action=')
  userArgv.filter = returnFlag('filter=')
  userArgv.name = returnFlag('name=')
  userArgv.newName = returnFlag('newName')
  userArgv.extension = returnFlag('extension')
  userArgv.dirToMove = returnFlag('dirToMove=')

  if (Object.values(userArgv).every(el => el === undefined)) {
    throw new Error('There is no argments, please enter it !')
  } else {
    createProcess(userArgv.action, userArgv.filter)
  }
}

console.log('START !!')
// TODO : sync getFilesList = if getArgv && !filesList.lenght => createProcess()
getArgv()