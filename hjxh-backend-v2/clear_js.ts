import fs, { Dirent } from "fs";
import path from "path";


const clearDir = (p: string) => {
  if(p.endsWith('node_modules')) return;

  fs.readdir(p, {withFileTypes: true},(e, files) => {
    files.forEach(file => {
      const filePath = path.join(p, file.name)
      if(file.isDirectory()){
        clearDir(filePath)
      }else {
        if(file.name.endsWith('.js')){
          if(files.find(f => f.name === file.name.replace('ts', 'js'))){
            console.log(`deleting target js file: ${filePath}`);
            fs.unlink(filePath, (e=> {
              if(e) throw e
              console.log('deleted target js file: ' + filePath);
            }))
          }
        }
      }
    })
  })
}

clearDir('/Users/mark/projects/HJXH/hjxh-js')