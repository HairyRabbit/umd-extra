// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * ResolveUMDExportor
 *
 * Find the installed UMD library global export name.
 *
 *
 * Examples:
 *
 * const resolveUMDName = require('rabbit-resolve-umd-exportor')
 *
 * resolveUMDName('jquery')           //=> jQuery
 * resolveUMDName('react')            //=> React
 * resolveUMDName('react-router-dom') //=> ReactRouterDOM
 *
 * // Library used by a polyfill
 * resolveUMDName('bootstrap')        //=> null
 * resolveUMDName('isomorphic-fetch') //=> null
 */


/// CODE


import { omit, identity } from 'lodash'
import { readFile }       from 'fs-extra'
import { JSDOM }          from 'jsdom'
import { Script }         from 'vm'
import pkg                from '../package.json'
import resolveUMDLibpath  from './resolve-umd-libpath.js'


export default function resolveUMDExport (libname: string): Promise<?string> {

  const dom = new JSDOM('', { runScripts: 'outside-only' })
  
  let cache: Array<string>;

      
  function findDependenciesAll(libname) {
    let stack = []

    function recur(libname) {
      return new Promise(function (resolve, reject) {
        Promise.resolve(libname)
          .then(findDependencies)
          .then(deps => {
            if(!deps.length) return resolve()
            stack = stack.concat(deps)
            return Promise.all(deps.map(recur))
          }).then(resolve)
      })
    }

    return recur(libname).then(() => stack)
  }
  
  
  return new Promise(function (resolve, reject) {
    Promise.resolve(libname)
      .then(findDependenciesAll)
      .then(deps => Promise.all(deps.map(resolveUMDLibpath)))
      .then(deps => Promise.all(deps.map(evalScriptFromFile(dom))))
      .then(() => libname)
      .then(resolveUMDLibpath)
      .then(evalScriptFromFile(dom, dom => cache = Object.keys(dom.window)))
      .then(() => {        
        const name = Object.keys(omit(dom.window, cache))
              .filter(str => !str.startsWith('_')
                      && str.length > 1
                      && !str.match(/\d{4}$/))

        if(name.length) return resolve(name[0])
        else {
          // Report can't find warning.
          console.warn(`[umd-extra] Can't find any global name from \
'${libname}'.

  1. ${libname} was a plugin or polyfill. Some usage like:

     // Code:
     import '${libname}'

  2. A bug, please report it at ${pkg.bugs.url}
`)
          resolve(null)
        }
      })
      .catch(reject)
  })
}


/// HELPERS

export function makeVMScript (content: Buffer): * {
  return new Script(`(function(){${content}}.bind(window))()`)
}

export function evalScript (dom: *, filepath: string) {
  return function (scripts: *): Promise<void> {
    return new Promise(function (resolve, reject) {
      try {
        dom.runVMScript(scripts)
        resolve(filepath)
      } catch (err) {
        reject(new Error(`[umd-extra] \
Catch vm eval scripts errors when eval '${filepath}'. 

${err}`))
      }
    })
  }
}

export function evalScriptFromFile (dom: *, beforeEval?: Function): Function {
  return function (filepath: string): Promise<void> {
    beforeEval = beforeEval || (dom => identity)
    return Promise.resolve(filepath)
      .then(readFile)
      .then(makeVMScript)
      .then(beforeEval(dom))
      .then(evalScript(dom, filepath))
  }
}

export function findDependencies (libname: string): Array<string> {
  return new Promise(function (resolve, reject) {
    let pkgPath
    try {
      pkgPath = require.resolve(`${libname}/package.json`)
    } catch (err) {
      reject(new Error(`[umd-extra] \
Can't find config file for '${libname}', please install at first.
Use Yarn:
  yarn add ${libname}
Use Npm:
  npm install ${libname}
`))
    }

    Promise.resolve(pkgPath)
      .then(readFile)
      .then(JSON.parse)
      .then(pkg => Object.keys(pkg.peerDependencies || {}))
      .then(resolve)
      .catch(reject)
  })
}