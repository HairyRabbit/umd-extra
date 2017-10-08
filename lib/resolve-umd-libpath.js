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
import NotInstalledError  from './utils/NotInstalledError'


export default function (libname: string): Promise<string> {
  const dirResolver    = makeGlobPatten(['umd', 'dist', 'build', 'js'])
  const directoryPath  = `node_modules/${libname}/`
  const umdPathName    = `${dirResolver}/{${dirResolver}/,}`
  const fileName       = `*([!.])?(.production).min.js`
  const libraryUMDPath = directoryPath + umdPathName + fileName

  return new Promise(function (resolve, reject) {
    glob(libraryUMDPath, function (err, res) {
      if (err)                   return reject(err)
      if (res.length === 0)      return reject(new NotInstalledError(libname))
      else if (res.length === 1) return resolve(res[0])
      else                       return resolve(matchLibname(libname, res)) 
    })
  })
}


/// HELPERS

/**
 * Make glob pattens.
 *
 * @private
 *
 * @example
 * makeGlobPatten([foo, bar]) //=> "+(foo|bar)"
 *
 * @param {Array<string>} arr
 * @return {string} 
 */
export function makeGlobPatten (arr: Array<string>): string {
  return `+(${arr.join('|')})`
}

/**
 * Select most matched path name.
 *
 * @private
 *
 * @example
 * matchLibname('foo', ['foo-bar', 'Foo']) 
 *   //=> 'Foo'
 * matchLibname('foo', ['dist/foo', 'dist/dist/foo']) 
 *   //=> 'dost/dist/foo'
 * matchLibname('foo', ['fooBar', 'foo-bar-baz']) 
 *   //=> 'fooBar'
 *
 * @param {string} libname
 * @param {Array<string>} arr - library paths
 * @return {string}
 */
export function matchLibname (libname: string, arr: Array<string>): string {
  // Format libname when name ends with '.js'
  libname = libname.endsWith('.js') ? libname.slice(0, -3) : libname
  libname = words(libname)
  const namecases = arr.filter(name => {
    const basename = path.basename(name)
    const filename = basename.slice(0, basename.indexOf('.'))
    return isEqual(libname, words(filename))  
  })

  const len = namecases.length
  
  if (len === 1)    return namecases[0]
  else if (len > 1) return namecases.sort().reverse()[0]
  else              return arr.sort(sortByWordsLength)[0]

  function sortByWordsLength(a: string, b: string): number {
    return words(a).length - words(b).length
  }
}
