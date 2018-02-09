// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS

import { exportName } from '../src'

describe('Simple library', function () {
  test('react -> React', function () {
    return expect(exportName('react')).resolves
      .toEqual('React')
  })
  test('js-data -> JSData', function () {
    return expect(exportName('js-data')).resolves
      .toEqual('JSData')
  })
})

describe('Library need dom', function () {
  test('jquery -> jQuery', function () {
    return expect(exportName('jquery')).resolves
      .toEqual('jQuery')
  })
})

describe('Library as a polyfill or plugin', function () {
  test('bootstrap -> null', function () {
    return expect(exportName('bootstrap')).resolves
      .toEqual(null)
  })
})

describe('Library was null', function () {
  test('jquery -> jQuery', function () {
    return expect(exportName('normalize.css')).resolves
      .toEqual(null)
  })
})

describe('Library have dependencies', function () {
  test('react-dom -> ReactDOM', function () {
    return expect(exportName('react-dom')).resolves
      .toEqual('ReactDOM')
  })
  test('react-router-dom -> ReactRouterDOM', function () {
    return expect(exportName('react-router-dom')).resolves
      .toEqual('ReactRouterDOM')
  })
  test('react-router-redux -> ReactRouterRedux', function () {
    return expect(exportName('react-router-redux')).resolves
      .toEqual('ReactRouterRedux')
  })
  test('js-data-http -> JSDataHttp', function () {
    return expect(exportName('js-data-http')).resolves
      .toEqual('JSDataHttp')
  })

  // TODO: Add test, nested peer dependencies.
})
