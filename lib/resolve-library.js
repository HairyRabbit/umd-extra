// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * resolve-library
 *
 * Get library contents.
 *
 *
 * Code:
 */

import fs from 'fs'

export default function (name): Promise<Buffer> {
  return new Promise(function (resolve, reject) {
    try {
      const filepath = require.resolve(name)
      resolve(filepath)
    } catch (e) {
      console.warn(`[ResolveUMDExportor] ${name} not found in node_modules.`)
      console.warn(`[ResolveUMDExportor] install ${name} start.`)
      reject(name)
    }
  })
}

function resolveLibraryFilePath (name) {
  
}
