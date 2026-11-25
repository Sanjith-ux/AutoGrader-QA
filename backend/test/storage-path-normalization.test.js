import assert from 'node:assert/strict'
import { copyFileSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { after, before, describe, test } from 'node:test'
import { inspectFile, uploadRoot } from '../src/services/submissionFiles.js'

describe('TDD Demonstration: Cross-Platform Storage Path Normalization', () => {
  const fixturePdf = path.resolve(fileURLToPath(new URL('./fixtures/report.pdf', import.meta.url)))
  const testSubdir = path.join(uploadRoot, 'b4e54826-6f81-4bc9-9371-c03780517789')
  const testFile = path.join(testSubdir, 'e1762744-a690-4822-a5ec-08f972e2764b')

  before(() => {
    mkdirSync(testSubdir, { recursive: true })
    copyFileSync(fixturePdf, testFile)
  })

  after(() => {
    rmSync(testSubdir, { recursive: true, force: true })
  })

  test('TDD GREEN: inspectFile returns normalized POSIX storagePath with forward slashes on Windows paths', async () => {
    const file = {
      originalname: 'report.pdf',
      path: testFile,
      size: 350,
    }

    const inspected = await inspectFile(file)

    assert.equal(
      inspected.storagePath.includes('\\'),
      false,
      `storagePath contains Windows backslash: "${inspected.storagePath}"`
    )
    assert.match(
      inspected.storagePath,
      /^[a-f0-9-]+\/[a-f0-9-]+$/,
      `storagePath "${inspected.storagePath}" does not match required POSIX pattern UUID/UUID`
    )
    assert.equal(
      inspected.storagePath,
      'b4e54826-6f81-4bc9-9371-c03780517789/e1762744-a690-4822-a5ec-08f972e2764b'
    )
  })

  test('TDD REFACTOR: Verifies normalization is idempotent on paths already using POSIX separators', async () => {
    // POSIX representation of the same file path
    const posixPath = testFile.replaceAll('\\', '/')
    const file = {
      originalname: 'windows\\nested\\report.pdf',
      path: posixPath,
      size: 350,
    }

    const inspected = await inspectFile(file)

    // Confirms originalName sanitizes backslashes to basename and storagePath uses forward slashes
    assert.equal(inspected.originalName, 'report.pdf')
    assert.equal(inspected.storagePath.includes('\\'), false)
    assert.match(inspected.storagePath, /^[a-f0-9-]+\/[a-f0-9-]+$/)
  })
})
