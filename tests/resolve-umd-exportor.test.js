// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS

import { exportName } from '../src'

describe('Simple library', () => {
  test('react -> React', () => {
    return expect(exportName('react')).resolves
      .toEqual('React')
  })

  test('js-data -> JSData', () => {
    return expect(exportName('js-data')).resolves
      .toEqual('JSData')
  })

  test('prop-types -> PropTypes', () => {
    return expect(exportName('prop-types')).resolves
      .toEqual('PropTypes')
  })
})

describe('Library need dom', () => {
  test('jquery -> jQuery', () => {
    return expect(exportName('jquery')).resolves
      .toEqual('jQuery')
  })
})

describe('Library as a polyfill or plugin', () => {
  test('bootstrap -> null', () => {
    return expect(exportName('bootstrap')).resolves
      .toEqual(null)
  })
})

describe('Library was null', () => {
  test('jquery -> jQuery', () => {
    return expect(exportName('normalize.css')).resolves
      .toEqual(null)
  })
})

describe('Library have dependencies', () => {
  test('react-dom -> ReactDOM', () => {
    return expect(exportName('react-dom')).resolves
      .toEqual('ReactDOM')
  })
  test('react-router-dom -> ReactRouterDOM', () => {
    return expect(exportName('react-router-dom')).resolves
      .toEqual('ReactRouterDOM')
  })
  test('react-router-redux -> ReactRouterRedux', () => {
    return expect(exportName('react-router-redux')).resolves
      .toEqual('ReactRouterRedux')
  })
  test('js-data-http -> JSDataHttp', () => {
    return expect(exportName('js-data-http')).resolves
      .toEqual('JSDataHttp')
  })

  // TODO: Add test, nested peer dependencies.
})
