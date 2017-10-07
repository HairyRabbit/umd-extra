// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS


import umdpath, { makeGlobPatten, matchLibname } from '../lib/resolve-umd-libpath'


describe('Find library umd file path', function () {
  test('react', function () {
    return expect(umdpath('react')).resolves
      .toEqual('node_modules/react/umd/react.production.min.js')
  })

  test('jquery', function () {
    return expect(umdpath('jquery')).resolves
      .toEqual('node_modules/jquery/dist/jquery.min.js')
  })

  test('failed, foo', function () {
    return expect(umdpath('foo')).rejects
      .toEqual(expect.stringMatching(/umd-extra/))
  })
})

describe('Test helpers', function () {
  describe('makeGlobPatten()', function () {
    test('usage', function () {
      expect(makeGlobPatten(['foo', 'bar']))
        .toBe('+(foo|bar)')
    })
  })  

  describe('matchLibname()', function () {
    test('matched', function () {
      expect(matchLibname('foo-bar', ['fooBar', 'foo-bar-baz']))
        .toBe('fooBar')
    })
    
    test('no matched', function () {
      expect(matchLibname('foo-bar', ['fooBarQuxQuxx', 'foo-bar-baz']))
        .toBe('foo-bar-baz')
    })
  })
})
