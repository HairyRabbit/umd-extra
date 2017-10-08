// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-


/// TESTS


import NotInstalledError from '../lib/utils/NotInstalledError'


test('new NotInstalledError()', function () {
  const err = new NotInstalledError('foo')
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toMatch(/module 'foo'/)
})
