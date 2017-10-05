// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow


/// TESTS


import { resolveUMDLibpath } from '../lib'


test('Find react@16 umd file', () => {
  expect(resolveUMDLibpath('react')).resolves
    .toEqual('node_modules/react/umd/react.production.min.js')
})

test('Find jquery umd file', () => {
  expect(resolveUMDLibpath('jquery')).resolves
    .toEqual('node_modules/jquery/dist/jquery.min.js')
})

test('Failed should throw error.', () => {
  expect(resolveUMDLibpath('foo')).rejects
    .toBeInstanceOf(Error)
})

