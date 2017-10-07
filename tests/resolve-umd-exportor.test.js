// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS


import { resolveUMDExportor } from '../lib'


describe('Simple library', function () {
  test('react -> React', function () {
    return expect(resolveUMDExportor('react')).resolves
      .toEqual('React')
  })
})

describe('Library need dom', function () {
  test('jquery -> jQuery', function () {
    return expect(resolveUMDExportor('jquery')).resolves
      .toEqual('jQuery')
  })
})

describe('Library as a polyfill or plugin', function () {
  test('bootstrap -> null', function () {
    return expect(resolveUMDExportor('bootstrap')).resolves
      .toEqual(null)
  })
})

describe('Library have dependencies', function () {  
  test('react-dom -> ReactDOM', function () {
    return expect(resolveUMDExportor('react-dom')).resolves
      .toEqual('ReactDOM')
  })
  test('react-router-dom -> ReactRouterDOM', function () {
    return expect(resolveUMDExportor('react-router-dom')).resolves
      .toEqual('ReactRouterDOM')
  })
  test('react-router-redux -> ReactRouterRedux', function () {
    return expect(resolveUMDExportor('react-router-redux')).resolves
      .toEqual('ReactRouterRedux')
  })
})
