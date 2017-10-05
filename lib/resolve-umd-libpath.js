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
 * const { UMDLibpath } = require('rabbit-umd-extra')
 *
 * UMDLibpath('jquery') //=> 'node_modules/jquery/dist/jquery.min.js'
 * UMDLibpath('react')  //=> 'node_modules/react/umd/react-production.js'
 */


/// CODE


import glob from 'glob'


export default function (libname: string): Promise<string> {
  const dirResolver      = makeGlobPatten(['umd', 'dist', 'build'])
  const fileResolver     = makeGlobPatten([libname, 'index'])  
  const directoryPath    = `node_modules/${libname}`
  const umdPathName      = `${dirResolver}`
  const fileName         = `${fileResolver}?(.*).min.js`
  const libraryUMDPath   = [directoryPath, umdPathName, fileName].join('/')

  return new Promise(function (resolve, reject) {
    glob(libraryUMDPath, function (err, res) {
      if (err) {
        reject(err)
        return
      }
      
      if (res.length === 0) {
        reject(new Error(`[ResolveUMDLibpath] Can't find any file from '${libname}'`))
        return
      }
      
      resolve(res[0])
    })
  })
}


/// HELPERS

function makeGlobPatten (arr: Array<string>): string {
  return `+(${arr.join('|')})`
}
