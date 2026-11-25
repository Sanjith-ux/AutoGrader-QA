import { randomUUID } from 'node:crypto'
import { readFile, rm } from 'node:fs/promises'
import newman from 'newman'

const mongoUri = process.env.MONGODB_API_TEST_URI
if (!/^mongodb:\/\/127\.0\.0\.1:[1-9]\d{0,4}\/labtrack_api_test$/.test(mongoUri ?? '')) {
  throw new Error('Set MONGODB_API_TEST_URI to mongodb://127.0.0.1:<port>/labtrack_api_test on a disposable MongoDB instance.')
}

const collection = JSON.parse(await readFile(new URL('./labtrack.postman_collection.json', import.meta.url), 'utf8'))
process.env.MONGODB_TEST_URI = mongoUri
process.env.NODE_ENV = 'test'
process.env.JWT_EXPIRES_IN = '5m'

// Reuse the test suite's database checks, synthetic users, API listener and scoped cleanup.
const { createTestContext } = await import('../../backend/testing/context.js')
const context = await createTestContext()
try {
  const runId = randomUUID()
  const summary = await new Promise((resolve, reject) => {
    newman.run({
      collection,
      envVar: [
        { key: 'baseUrl', value: `${context.baseUrl}/api` },
        { key: 'lecturerEmail', value: context.lecturer.email },
        { key: 'studentEmail', value: context.student.email },
        { key: 'password', value: 'password123' },
        { key: 'assignmentTitle', value: `QA practical ${runId}` },
        { key: 'deadline', value: new Date(Date.now() + 7 * 86_400_000).toISOString() },
      ],
      timeout: 60000,
      timeoutRequest: 10000,
      timeoutScript: 5000,
      ignoreRedirects: true,
      bail: ['failure'],
      reporters: ['cli'],
      reporter: { cli: { noConsole: true, noAssertions: true } },
    }, (error, result) => error ? reject(error) : resolve(result))
  })
  if (summary.run.failures.length || summary.run.stats.requests.total !== collection.item.length) {
    process.exitCode = 1
  }
} finally {
  try {
    await context.cleanup()
  } finally {
    await rm(context.storageRoot, { recursive: true, force: true })
  }
}
