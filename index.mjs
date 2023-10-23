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

function caseInsensitiveRegExp(str) {
  const strLowerCase = str.toLowerCase();
  const regExp = new RegExp(`\\.${strLowerCase}$`, 'i') // case insensitive matching
  return regExp
}


function deleteFiles(userArgv, files) {
  const regExp = caseInsensitiveRegExp(userArgv.extension)
  files.forEach((file) => {
    if (userArgv.filter === 'extension' && regExp.test(file)) {
      console.log('Delete => ', file)
      fs.unlinkSync(file)
    } else if (userArgv.filter === 'name') {
      const regex = `/${userArgv.name}/g`;
      if (path.basename(file, path.extname(file)) === userArgv.name ||
        file.includes(userArgv.name)
      ) {
        console.log('Delete => ', file)
        fs.unlinkSync(file)
      }
    }
  })
}

function uppercase(str) {
  if (typeof str === 'string') {
    console.log('uppercase: ', str.toUpperCase())
    // return str.toUppercase();
  }
}

function checkFolder(folder) {
  const folderPath = path.resolve(folder);
  if (fs.existsSync(folderPath)) {
    return folderPath;
  } else {
    fs.mkdirSync(folderPath, { recursive: true }); // recursive: true will create parent folders if needed
    return folderPath;
  }
}

function moveFiles(userArgv, files) {
  // ugly ⬇️⬇️⬇️⬇️
  const regExp = userArgv.extension !== undefined ? caseInsensitiveRegExp(userArgv.extension) : null;
  // ugly ⬆️⬆️⬆️⬆️
  const destination = checkFolder(userArgv.destination);
  if (destination === null) {
    console.error(`Error checking/creating folder: ${error.message}`);
    return
  }

  files.forEach((file) => {
    if (userArgv.filter === 'extension' && regExp.test(file)) {
      const sourceFilePath = file;
      const destinationFilePath = path.join(destination, path.basename(file));
      fs.rename(sourceFilePath, destinationFilePath, (err) => {
        if (err) {
          console.error(`Error moving the file: ${err}`);
        } else {
          console.log(`${file} moved to ${destination}`);
        }
      });
    } else if (userArgv.filter === 'name') {
      if (
        path.basename(file, path.extname(file)) === userArgv.name ||
        file.includes(userArgv.name)
      ) {
        const sourceFilePath = file;
        const destinationFilePath = path.join(destination, path.basename(file));
        fs.rename(sourceFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error(`Error moving the file: ${err}`);
          } else {
            console.log(`${file} moved to ${destination}`);
          }
        });
      }
    }
  });

}

function createProcess(userArgv, files) {
  switch (userArgv.action) {
    case 'move':
      moveFiles(userArgv, files);
      break;
    case 'rename':
      break;
    case 'delete':
      deleteFiles(userArgv, files);
      break;
    default:
      console.log('action undefined !');
  }
}

function getArgv() {
  const userEntries = {}
  userEntries.action = returnFlag('action=')
  userEntries.filter = returnFlag('filter=')
  userEntries.name = returnFlag('name=')
  userEntries.newName = returnFlag('newName')
  userEntries.extension = returnFlag('extension')
  userEntries.destination = returnFlag('destination=')

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
