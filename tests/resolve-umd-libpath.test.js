// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS

import umdpath, { makeGlobPatten, suggest } from '../src/resolve-umd-libpath'

describe('Find library umd file path', () => {
  test('react', () => {
    return expect(umdpath('react')).resolves
      .toEqual('./node_modules/react/umd/react.production.min.js')
  })

  test('jquery', () => {
    return expect(umdpath('jquery')).resolves
      .toEqual('./node_modules/jquery/dist/jquery.min.js')
  })

  test('normalize.css', () => {
    return expect(umdpath('normalize.css')).resolves
      .toEqual('./node_modules/normalize.css/normalize.css')
  })

  test('classnames', () => {
    return expect(umdpath('classnames')).resolves
      .toEqual('./node_modules/classnames/index.js')
  })

  test('failed, foo', () => {
    return expect(umdpath('foo')).resolves.toBe(null)
  })
})

describe('Find library umd file path for dev version.', function () {
  test('react', () => {
    return expect(umdpath('react', true)).resolves
      .toEqual('./node_modules/react/umd/react.development.js')
  })

  test('jquery', () => {
    return expect(umdpath('jquery', true)).resolves
      .toEqual('./node_modules/jquery/dist/jquery.js')
  })

  test('failed, foo', () => {
    return expect(umdpath('foo', true)).resolves.toBe(null)
  })
})

describe('Test helpers', () => {
  describe('makeGlobPatten()', () => {
    test('usage', () => {
      expect(makeGlobPatten(['foo', 'bar']))
        .toBe('+(foo|bar)')
    })
  })

  describe('suggest()', () => {
    test('matched', () => {
      expect(suggest('foo-bar', ['fooBar', 'foo-bar-baz']))
        .toBe('fooBar')
    })

    test('no matched', () => {
      expect(suggest('foo-bar', ['fooBarQuxQuxx', 'foo-bar-baz']))
        .toBe('foo-bar-baz')
    })
  })
})
