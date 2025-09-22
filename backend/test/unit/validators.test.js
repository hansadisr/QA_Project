const { isStrongPassword, buildAuthToken } = require('../../src/utils/validators');
const jwt = require('jsonwebtoken');

test('isStrongPassword passes a good password', () => {
  expect(isStrongPassword('Strong#123')).toBe(true);
});
test('isStrongPassword fails a weak password', () => {
  expect(isStrongPassword('abc')).toBe(false);
});
test('buildAuthToken returns a signed JWT with uid', () => {
  const t = buildAuthToken('u1');
  const payload = jwt.decode(t);
  expect(payload.uid).toBe('u1');
});
