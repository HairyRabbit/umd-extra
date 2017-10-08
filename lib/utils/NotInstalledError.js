// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * NotInstalledError
 *
 * Not install module error.
 *
 * @class
 * @extends Error
 */
export default class NotInstalledError extends Error {
  /**
   * @constructor
   *
   * @param {string} libname
   * @param {string} [desc]
   */
  constructor(libname: string, desc?: string) {
    desc = desc ? '\n' + desc : ''
    super(`[umd-extra] \
Can't find module '${libname}'. You may need install it at first.${desc}

Use Yarn:
  yarn add ${libname}

Use Npm:
  npm install ${libname}  
`)
  }
}
