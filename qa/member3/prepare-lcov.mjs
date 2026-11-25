import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('../../', import.meta.url))
const results = resolve(repo, 'qa/member3/results')
const packages = ['backend', 'FrontEnd']
const reports = []

if (process.argv.length !== 2 && process.argv.length !== 4) {
  throw new Error('Pass both package LCOV paths in backend, FrontEnd order, or pass no paths.')
}

for (const [index, name] of packages.entries()) {
  const input = process.argv[index + 2] ?? resolve(results, `${name}.lcov.info`)
  const lines = (await readFile(input, 'utf8')).trim().split(/\r?\n/)
  let sources = 0
  let records = 0

  for (const [lineIndex, line] of lines.entries()) {
    if (line === 'end_of_record') records++
    if (!line.startsWith('SF:')) continue
    const source = line.slice(3).replaceAll('\\', '/')
    const absolute = isAbsolute(source) || source.startsWith(`${name}/`)
      ? resolve(repo, source)
      : resolve(repo, name, source)
    const repoPath = relative(repo, absolute).split(sep).join('/')
    if (!repoPath.startsWith(`${name}/src/`)) {
      throw new Error(`Unexpected coverage source in ${input}: ${source}`)
    }
    await access(absolute)
    lines[lineIndex] = `SF:${repoPath}`
    sources++
  }

  if (!sources || sources !== records) throw new Error(`No complete LCOV records in ${input}`)
  console.log(`${name}: ${sources} source file(s)`)
  reports.push(lines.join('\n'))
}

await mkdir(results, { recursive: true })
await writeFile(resolve(results, 'lcov.info'), reports.join('\n') + '\n')
