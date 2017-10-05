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

test('Find file path failed.', () => {
  expect(resolveUMDLibpath('foo')).rejects
    .toEqual(new Error("[ResolveUMDLibpath] Can't find any file from 'foo'"))
})

