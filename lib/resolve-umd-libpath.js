// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * resolve-umd-libpath
 *
 * Find installed library UMD file path.
 *
 *
 * Examples:
 *
 * const { resolveUMDLibpath } = require('rabbit-umd-extra')
 *
 * resolveUMDLibpath('jquery') 
 *   //=> 'node_modules/jquery/dist/jquery.min.js'
 * resolveUMDLibpath('react')  
 *   //=> 'node_modules/react/umd/react-production.min.js'
 */


/// CODE


import { words, isEqual } from 'lodash'
import path               from 'path'
import glob               from 'glob'


export default function (libname: string): Promise<string> {
  const dirResolver      = makeGlobPatten(['umd', 'dist', 'build', 'js'])
  const directoryPath    = `node_modules/${libname}/`
  const umdPathName      = `${dirResolver}/{${dirResolver}/,}`
  const fileName         = `*([!.])?(.production).min.js`
  const libraryUMDPath   = directoryPath + umdPathName + fileName

  return new Promise(function (resolve, reject) {
    glob(libraryUMDPath, function (err, res) {
      if (err) return reject(err)

      // Can't match any files.
      if (res.length === 0) {
        return reject(new Error(`[umd-extra] \
Can't find any UMD file from '${libname}'. \
You need install library '${libname}' at first.
Use Yarn:
  yarn add ${libname}
Use Npm:
  npm install ${libname}  
`))
      }

      // Match only one file.
      if(res.length === 1) return resolve(res[0])
      resolve(matchLibname(libname, res))
    })
  })
}


/// HELPERS

export function makeGlobPatten (arr: Array<string>): string {
  return `+(${arr.join('|')})`
}

export function matchLibname (libname: string, arr: Array<string>): string {
  const sortLibname = libname.endsWith('.js')
        ? libname.slice(0, -3)
        : libname 
  const namecases = arr.filter(name => {
    const filename = path.basename(name)
    const filedesc = filename.slice(0, filename.indexOf('.'))
    if(isEqual(words(sortLibname), words(filedesc))) return true
    return false
  })

  const len = namecases.length
  
  if(len === 1)    return namecases[0]
  else if(len > 1) return namecases.sort().reverse()[0]    
  else             return arr.sort(sortByLength)[0]

  function sortByLength(a, b) {
    return words(a).length - words(b).length
  }
}
