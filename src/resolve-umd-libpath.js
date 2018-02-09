/**
 * resolve-umd-libpath
 *
 * Find installed library UMD file path.
 *
 * @module umd-extra/resolveUMDLibpath
 *
 * @example
 *
 * const { exportPath } = require('@rabbitcc/umd-extra')
 *
 * exportPath('jquery')
 *   //=> 'node_modules/jquery/dist/jquery.min.js'
 * exportPath('react')
 *   //=> 'node_modules/react/umd/react-production.min.js'
 *
 * @flow
 */


/// CODE

import { words, isEqual } from 'lodash'
import path               from 'path'
import glob               from 'glob'


export default function exportPath(libname: string, isDev?: boolean, context?: string): Promise<string> {
  const dirResolver    = makeGlobPatten(['umd', 'dist', 'build', 'js'])
  const directoryPath  = `${context ? context + '/' : ''}node_modules/${libname}/`
  const umdPathName    = `${dirResolver}/{${dirResolver}/,}`
  const fileName       = !isDev
        ? '*([!.])?(.production).min.js'
        : '*([!.])?(.development).js'
  const libraryUMDPath = directoryPath + umdPathName + fileName

  return new Promise(function (resolve, reject) {
    glob(libraryUMDPath, function (err, res) {
      if (err)                   return reject(err)
      if (res.length === 0)      return reject(makeErrorMessage(libname))
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
 * Select most matching path name.
 *
 * @private
 *
 * @example
 * // 1. Most matching
 * matchLibname('foo', ['foo-bar', 'Foo'])
 *   //=> 'Foo'
 *
 * // 2. Deepest path
 * matchLibname('foo', ['dist/foo', 'dist/dist/foo'])
 *   //=> 'dost/dist/foo'
 *
 * // 3. Shortest name
 * matchLibname('foo', ['fooBar', 'foo-bar-baz'])
 *   //=> 'fooBar'
 *
 * @param {string} libname
 * @param {Array<string>} arr - library paths
 * @return {string}
 */
export function matchLibname (libname: string, arr: Array<string>): string {
  /**
   * Format libname when name ends with '.js'
   */
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

function makeErrorMessage(libname: string, desc?: string): string {
  desc = desc ? '\n' + desc : ''
  return `[umd-extra] \
Can't find module '${libname}'. You may need install it at first.${desc}

Use Yarn:
  yarn add ${libname}

Use Npm:
  npm install ${libname}`
}
