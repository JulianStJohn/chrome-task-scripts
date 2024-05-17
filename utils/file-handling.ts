import * as fs from 'fs'

export function getDataFile(filename){
  return JSON.parse(fs.readFileSync('./data/'+filename, 'utf8'))  
}

export function writeDataFile(filename, obj){
  fs.writeFileSync( './data/' + filename, JSON.stringify(obj, null, 2),'utf8')
}
