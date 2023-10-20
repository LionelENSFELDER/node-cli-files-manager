import * as fs from 'node:fs'
import * as readline from 'node:readline'
import * as path from 'path'
import { argv, cwd } from 'node:process'
import process from 'node:process'

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

function getFilesList(workDir) {
  const files = fs.readdirSync(workDir)
  return files
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

function deleteFiles(userArgv, files) {
  files.forEach((file) => {
    if (userArgv.filter === 'extension' && path.extname(file) === userArgv.extension) {
      console.log('Delete => ', file)
      fs.unlinkSync(file)
    } else if (userArgv.filter === 'name') {
      const regex = `/${userArgv.name}/g`;
      if (
        path.basename(file, path.extname(file)) === userArgv.name ||
        file.includes(userArgv.name)
      ) {
        console.log('Delete => ', file)
        fs.unlinkSync(file)
      }
    }
  })
}

function createProcess(userArgv, files) {
  switch (userArgv.action) {
    case 'move':
      break;
    case 'rename':
      break;
    case 'delete':
      deleteFiles(userArgv, files)
      break;
    default:
      console.log('action undefined !')
  }
}

function getArgv() {
  const userEntries = {}
  userEntries.action = returnFlag('action=')
  userEntries.filter = returnFlag('filter=')
  userEntries.name = returnFlag('name=')
  userEntries.newName = returnFlag('newName')
  userEntries.extension = returnFlag('extension')
  userEntries.dirToMove = returnFlag('dirToMove=')

  return userEntries
}

function start() {
  console.log('START !!');
  const workDir = process.cwd();
  const userArgv = { ...getArgv() };
  const files = getFilesList(workDir);

  if (Object.values(userArgv).every(el => el === undefined)) {
    throw new Error('There is no arguments !')
  }
  if (files.length === 0) {
    throw new Error('There is no files in folder !')
  }

  createProcess(userArgv, files);
}

start()