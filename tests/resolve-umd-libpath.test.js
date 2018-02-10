/**
 * @jest
 */

import path from 'path'
import umdpath, { makeGlobPatten, suggest } from '../src/resolve-umd-libpath'

beforeEach(() => {
  jest.resetModules();
})

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

  test('prop-types', () => {
    return expect(umdpath('prop-types')).resolves
      .toEqual('./node_modules/prop-types/prop-types.min.js')
  })

  test('failed, foo', () => {
    return expect(umdpath('foo')).resolves.toBe(null)
  })
})

describe('Find library umd file path for dev version.', () => {
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

test('should reject when glob throw error', () => {
  jest.doMock('glob', () => {
    return (_, cb) => cb(42)
  })
  const umdPath = require('../src/resolve-umd-exportor').default
  return expect(umdPath('foo')).rejects.toBe(42)
})

test('should reject when glob min file throw error', () => {
  jest.doMock('glob', () => {
    return (p, cb) => /\+\(umd/.test(p) ? cb(null, []) : cb(42)
  })
  const umdPath = require('../src/resolve-umd-exportor').default
  return expect(umdPath('foo')).rejects.toBe(42)
})

test('react with context', () => {
  return expect(umdpath('react', false, process.cwd())).resolves
    .toMatch('node_modules/react/umd/react.production.min.js')
})

test('should be null when fine failed', () => {
  jest.doMock('glob', () => {
    return (_, cb) => cb(null, [])
  })
  const umdPath = require('../src/resolve-umd-exportor').default
  return expect(umdPath('foo')).resolves.toBe(null)
})
