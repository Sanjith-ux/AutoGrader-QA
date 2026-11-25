import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const backendRequire = createRequire(new URL('../../../backend/package.json', import.meta.url))
const { AfterAll, BeforeAll, Given, Then, When } = backendRequire('@cucumber/cucumber')
const jwt = backendRequire('jsonwebtoken')
const mongoose = backendRequire('mongoose')

import app from '../../../backend/src/app.js'
import User from '../../../backend/src/models/User.js'
import { assertSafeTestDatabase, testMongoUri, testSecret } from '../../../backend/testing/context.js'

let server
let baseUrl
const trackedEmails = new Set()

BeforeAll(async () => {
  const uri = process.env.MONGODB_TEST_URI || testMongoUri || 'mongodb://127.0.0.1:27017/labtrack_test'
  assertSafeTestDatabase(uri)
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  }
  server = app.listen(0)
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

AfterAll(async () => {
  if (trackedEmails.size > 0) {
    await User.deleteMany({ email: { $in: Array.from(trackedEmails) } })
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve))
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
})

Given('a registered student exists with email {string} and password {string}', async function (email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  trackedEmails.add(normalizedEmail)

  await User.deleteOne({ email: normalizedEmail })

  const user = await User.create({
    name: 'BDD Test Student',
    email: normalizedEmail,
    password,
    role: 'student',
  })

  this.studentUser = user
})

When('the student attempts to log in with email {string} and password {string}', async function (email, password) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  this.responseStatus = response.status
  this.responseHeaders = response.headers
  this.responseBody = await response.json()
})

Then('the authentication response status code should be {int}', function (expectedStatus) {
  assert.equal(
    this.responseStatus,
    expectedStatus,
    `Expected HTTP status ${expectedStatus} but received ${this.responseStatus}. Body: ${JSON.stringify(this.responseBody)}`
  )
})

Then('the response should contain a valid JWT authentication token', function () {
  assert.ok(this.responseBody.token, 'Expected token property in response body')
  assert.equal(typeof this.responseBody.token, 'string', 'Token should be a string')

  const decoded = jwt.verify(this.responseBody.token, testSecret)
  assert.equal(decoded.role, 'student')
  assert.equal(decoded.sub, this.studentUser._id.toString())
})

Then('the returned user profile should have role {string} and email {string}', function (expectedRole, expectedEmail) {
  assert.ok(this.responseBody.user, 'Expected user profile in response body')
  assert.equal(this.responseBody.user.role, expectedRole)
  assert.equal(this.responseBody.user.email, expectedEmail.trim().toLowerCase())
})

Then('the returned user profile should not expose password or sensitive hash data', function () {
  const userJson = JSON.stringify(this.responseBody.user)
  assert.equal(this.responseBody.user.password, undefined)
  assert.ok(!userJson.includes('password'), 'User object must not contain password key')
  assert.ok(!/\$2[aby]\$/.test(userJson), 'User object must not expose bcrypt hash fragments')
})

Then('the response error message should be {string}', function (expectedMessage) {
  assert.equal(this.responseBody.message, expectedMessage)
})

Then('no authentication token should be returned', function () {
  assert.equal(this.responseBody.token, undefined, 'Token must not be present on authentication failure')
})
