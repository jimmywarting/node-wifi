import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)

export default async ({ cmd, args }) => {
  const { stdout } = await exec(cmd, args)
  return stdout.split('\n').map(line => line.trim()).filter(Boolean)
}
