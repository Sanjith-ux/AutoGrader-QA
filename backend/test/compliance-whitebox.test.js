import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { checkCompliance, submissionError } from '../src/services/submissionFiles.js'

describe('White-Box Unit Testing: checkCompliance', () => {
  const baseDeadline = new Date('2030-05-15T12:00:00.000Z')
  const validAssignment = {
    deadline: baseDeadline,
    allowedFileTypes: ['PDF', 'ZIP'],
    maxFileSizeMB: 5,
    requiredFiles: ['Lab Report', 'Source Code'],
  }

  describe('Basis Path Coverage (V(G) = 6)', () => {
    test('Basis Path 1 (TC-WB-01): Nominal / All checks pass (1-2-3-5-6-7-9-10-11-13-14-15-17-18-19-21)', () => {
      const files = [
        { type: 'PDF', size: 1024 * 1024, attachment: 'Lab Report' },
        { type: 'ZIP', size: 2 * 1024 * 1024, attachment: 'Source Code' },
      ]
      const submittedAt = new Date('2030-05-15T11:59:00.000Z')

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, true)
      assert.equal(result.checks.deadline.passed, true)
      assert.equal(result.checks.deadline.message, 'Submitted on or before the deadline.')
      assert.equal(result.checks.fileType.passed, true)
      assert.match(result.checks.fileType.message, /Accepted formats: PDF, ZIP/)
      assert.equal(result.checks.fileSize.passed, true)
      assert.equal(result.checks.fileSize.message, 'Maximum 5 MB per file.')
      assert.equal(result.checks.requiredFiles.passed, true)
      assert.equal(result.checks.requiredFiles.message, 'All required attachment labels are present.')
    })

    test('Basis Path 2 (TC-WB-02): Late submission failure (1-2-4-5-6-7-9-10-11-13-14-15-17-18-20-21)', () => {
      const files = [
        { type: 'PDF', size: 1024 * 1024, attachment: 'Lab Report' },
        { type: 'ZIP', size: 2 * 1024 * 1024, attachment: 'Source Code' },
      ]
      const submittedAt = new Date('2030-05-15T12:00:01.000Z') // 1 sec late

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, false)
      assert.equal(result.checks.deadline.passed, false)
      assert.equal(result.checks.deadline.message, 'Submitted after the deadline; marked late.')
      assert.equal(result.checks.fileType.passed, true)
      assert.equal(result.checks.fileSize.passed, true)
      assert.equal(result.checks.requiredFiles.passed, true)
    })

    test('Basis Path 3 (TC-WB-03): Disallowed file type failure (1-2-3-5-6-8-9-10-11-13-14-15-17-18-20-21)', () => {
      const files = [
        { type: 'PNG', size: 500 * 1024, attachment: 'Lab Report' }, // PNG not in ['PDF', 'ZIP']
        { type: 'ZIP', size: 1024 * 1024, attachment: 'Source Code' },
      ]
      const submittedAt = new Date('2030-05-15T11:00:00.000Z')

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, false)
      assert.equal(result.checks.deadline.passed, true)
      assert.equal(result.checks.fileType.passed, false)
      assert.equal(result.checks.fileSize.passed, true)
      assert.equal(result.checks.requiredFiles.passed, true)
    })

    test('Basis Path 4 (TC-WB-04): Oversized file failure (1-2-3-5-6-7-9-10-12-13-14-15-17-18-20-21)', () => {
      const files = [
        { type: 'PDF', size: 6 * 1024 * 1024, attachment: 'Lab Report' }, // 6MB > 5MB limit
        { type: 'ZIP', size: 1024 * 1024, attachment: 'Source Code' },
      ]
      const submittedAt = new Date('2030-05-15T11:00:00.000Z')

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, false)
      assert.equal(result.checks.deadline.passed, true)
      assert.equal(result.checks.fileType.passed, true)
      assert.equal(result.checks.fileSize.passed, false)
      assert.equal(result.checks.requiredFiles.passed, true)
    })

    test('Basis Path 5 (TC-WB-05): Missing required attachment failure (1-2-3-5-6-7-9-10-11-13-14-16-17-18-20-21)', () => {
      const files = [
        { type: 'PDF', size: 1024 * 1024, attachment: 'Lab Report' },
        // Missing 'Source Code'
      ]
      const submittedAt = new Date('2030-05-15T11:00:00.000Z')

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, false)
      assert.equal(result.checks.deadline.passed, true)
      assert.equal(result.checks.fileType.passed, true)
      assert.equal(result.checks.fileSize.passed, true)
      assert.equal(result.checks.requiredFiles.passed, false)
      assert.equal(result.checks.requiredFiles.message, 'Missing attachments: Source Code.')
    })

    test('Basis Path 6 (TC-WB-06): Compound failure across all predicates (1-2-4-5-6-8-9-10-12-13-14-16-17-18-20-21)', () => {
      const files = [
        { type: 'EXE', size: 10 * 1024 * 1024, attachment: 'Arbitrary' },
      ]
      const submittedAt = new Date('2030-05-15T12:05:00.000Z') // late

      const result = checkCompliance(validAssignment, files, submittedAt)

      assert.equal(result.passed, false)
      assert.equal(result.checks.deadline.passed, false)
      assert.equal(result.checks.fileType.passed, false)
      assert.equal(result.checks.fileSize.passed, false)
      assert.equal(result.checks.requiredFiles.passed, false)
      assert.match(result.checks.requiredFiles.message, /Lab Report, Source Code/)
    })
  })

  describe('Boundary Value Analysis (BVA)', () => {
    test('BVA-01: Deadline exact timestamp boundary (submittedAt == deadline) passes on-time check', () => {
      const exactDeadline = new Date('2030-06-01T15:00:00.000Z')
      const assignment = { ...validAssignment, deadline: exactDeadline }
      const files = [
        { type: 'PDF', size: 100, attachment: 'Lab Report' },
        { type: 'ZIP', size: 100, attachment: 'Source Code' },
      ]

      const result = checkCompliance(assignment, files, new Date('2030-06-01T15:00:00.000Z'))
      assert.equal(result.checks.deadline.passed, true)
      assert.equal(result.passed, true)
    })

    test('BVA-02: Deadline boundary + 1 millisecond fails on-time check', () => {
      const exactDeadline = new Date('2030-06-01T15:00:00.000Z')
      const assignment = { ...validAssignment, deadline: exactDeadline }
      const files = [
        { type: 'PDF', size: 100, attachment: 'Lab Report' },
        { type: 'ZIP', size: 100, attachment: 'Source Code' },
      ]

      const result = checkCompliance(assignment, files, new Date('2030-06-01T15:00:00.001Z'))
      assert.equal(result.checks.deadline.passed, false)
      assert.equal(result.passed, false)
    })

    test('BVA-03: File size exact maximum limit boundary (size == maxFileSizeMB * 1024 * 1024) passes', () => {
      const limitBytes = 5 * 1024 * 1024 // 5,242,880 bytes
      const files = [
        { type: 'PDF', size: limitBytes, attachment: 'Lab Report' },
        { type: 'ZIP', size: 100, attachment: 'Source Code' },
      ]

      const result = checkCompliance(validAssignment, files, new Date('2030-05-15T10:00:00.000Z'))
      assert.equal(result.checks.fileSize.passed, true)
      assert.equal(result.passed, true)
    })

    test('BVA-04: File size exact boundary + 1 byte (limit + 1) fails file size check', () => {
      const overLimitBytes = (5 * 1024 * 1024) + 1 // 5,242,881 bytes
      const files = [
        { type: 'PDF', size: overLimitBytes, attachment: 'Lab Report' },
        { type: 'ZIP', size: 100, attachment: 'Source Code' },
      ]

      const result = checkCompliance(validAssignment, files, new Date('2030-05-15T10:00:00.000Z'))
      assert.equal(result.checks.fileSize.passed, false)
      assert.equal(result.passed, false)
    })
  })

  describe('Equivalence Partitioning & Normalization Edge Cases', () => {
    test('normalizes attachment label whitespace and case-insensitivity', () => {
      const files = [
        { type: 'PDF', size: 500, attachment: '  lab report  ' }, // trimmed & lowercased matches 'Lab Report'
        { type: 'ZIP', size: 500, attachment: 'SOURCE CODE' },   // lowercased matches 'Source Code'
      ]

      const result = checkCompliance(validAssignment, files, new Date('2030-05-15T10:00:00.000Z'))
      assert.equal(result.checks.requiredFiles.passed, true)
      assert.equal(result.passed, true)
    })

    test('handles empty required files list when assignment has no required attachments', () => {
      const assignment = { ...validAssignment, requiredFiles: [] }
      const files = [
        { type: 'PDF', size: 500, attachment: 'Any Optional Attachment' },
      ]

      const result = checkCompliance(assignment, files, new Date('2030-05-15T10:00:00.000Z'))
      assert.equal(result.checks.requiredFiles.passed, true)
      assert.equal(result.passed, true)
    })
  })

  describe('Helper Utility: submissionError', () => {
    test('constructs Error object decorated with HTTP status code and compliance object', () => {
      const dummyCompliance = { passed: false, checks: {} }
      const err = submissionError(400, 'Compliance failed', dummyCompliance)

      assert.ok(err instanceof Error)
      assert.equal(err.message, 'Compliance failed')
      assert.equal(err.status, 400)
      assert.deepEqual(err.compliance, dummyCompliance)
    })
  })
})
