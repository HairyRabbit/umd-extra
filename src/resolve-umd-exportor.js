/**
 * resolve-umd-exportor
 *
 * Find the installed UMD library global export name.
 *
 * @module umd-extra/resolve-umd-exportor
 *
 * @example
 *
 * const { exportName } = require('@rabbitcc/umd-extra')
 *
 * exportName('jquery')           //=> jQuery
 * exportName('react')            //=> React
 * exportName('react-router-dom') //=> ReactRouterDOM
 *
 * // Library used by a polyfill
 * exportName('bootstrap')        //=> null
 * exportName('isomorphic-fetch') //=> null
 *
 * @flow
 */

import path from 'path'
import { omit, identity } from 'lodash'
import { readFile } from 'fs-extra'
import { JSDOM } from 'jsdom'
import { Script } from 'vm'
import resolveUMDLibpath  from './resolve-umd-libpath.js'

type Cache = Array<string>;

const issueUrl: string = 'https://github.com/yuffiy/umd-extra/issues/new'

export default function exportName(libname: string, context?: string): Promise<?string> {
  // Cache all the window object keys.
  let cache: Cache

  // Create jsdom.
  const dom = new JSDOM('', { runScripts: 'outside-only' })

  return new Promise(function (resolve, reject) {
    resolveUMDLibpath(libname, false, context)
      .then(filePath => {
        /**
         * if dep was a css lib, like normalize.css, return null as result
         */
        if(!filePath || '.js' !== path.extname(filePath)) {
          resolve(null)
          return
        } else {
          Promise.resolve(libname)
            .then(recurFindDependencies(context))
            .then(deps => Promise.all(deps.map(dep => resolveUMDLibpath(dep, false, context))))
            .then(deps => Promise.all(deps.map(evalScriptFromFile(dom))))
            .then(() => filePath)
            .then(evalScriptFromFile(dom, dom => cache = Object.keys(dom.window)))
            .then(() => {
              const name = Object.keys(omit(dom.window, cache))
                .filter(str => !str.startsWith('_')
                        && str.length > 1
                        && !str.match(/\d{4}$/))

              if(name.length) {
                resolve(name[0])
                return
              } else {
                // Report can't find warning.
                console.warn(`[umd-extra] Can't find any global name from \
'${libname}'.

  1. ${libname} was a plugin or polyfill. Some usage like:

     // Code:
     import '${libname}'

  2. A bug, please report it at ${issueUrl}
`)
                resolve(null)
              }
            })
            .catch(reject)
        }
      })
      .catch(reject)
  })
}


/// HELPERS

export function makeVMScript(content: Buffer): * {
  return new Script(`(function(){
${content.toString()}
}.bind(window))()`, {})
}

export function evalScript(dom: *, filepath: string) {
  return function (scripts: *): Promise<*> {
    return new Promise(function (resolve, reject) {
      try {
        dom.runVMScript(scripts)
        resolve(filepath)
      } catch (err) {
        console.warn(new Error(`[umd-extra] \
Catch vm eval scripts errors when eval '${filepath}'.`))
        console.error(err)
        reject(err)
      }
    })
  }
}

export function evalScriptFromFile(dom: *, beforeEval?: Function): Function {
  return function (filepath: string): Promise<*> {
    beforeEval = beforeEval || (dom => identity)
    return Promise.resolve(filepath)
      .then(readFile)
      .then(makeVMScript)
      .then(beforeEval(dom))
      .then(evalScript(dom, filepath))
  }
}

export function findDependencies(context?: string): Function {
  const pathPrefix = context ? context.replace(/\\/, '/') + '/node_modules' : './node_modules'
  return (libname: string): Promise<Array<string>> => {
    return new Promise(function (resolve, reject) {
      let keys
      try {
        const pkg = require(path.resolve(`${pathPrefix}/${libname}/package.json`))
        const deps = {
            ...pkg.peerDependencies
        }
        resolve(Object.keys(deps))
      } catch (err) {
        console.error(new Error(`[umd-extra] \
Can't find config file for '${libname}', please install at first.

Use Yarn:
  yarn add ${libname}
Use Npm:
  npm install ${libname}
`))
        reject(err)
      }
    })
  }
}

export function recurFindDependencies(context?: string): Function {
  return (libname: string): Promise<Array<string>> => {
    // Store peer dependencies.
    let collects = []

    return recur(libname).then(() => collects)

    function recur (libname) {
      return new Promise(function (resolve, reject) {
        Promise.resolve(libname)
          .then(findDependencies(context))
          .then(setCollects)
          .then(resolve)
          .catch(reject)

        function setCollects (deps) {
          if (!deps.length) return resolve()

          /**
           * Store deps and collect next task.
           */
          const promises = []
          deps.forEach(d => {
            collects.push(d)
            promises.push(recur(d))
          })

          return Promise.all(promises)
        }

        function done () {
          return resolve(collects)
        }
      })
    }
  }
}
