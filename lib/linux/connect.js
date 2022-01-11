/**
 * @param {import('../wifi.js').default} wifi
 * @param {string} password
 */
export function buildCmd (wifi, password) {
  const args = [
    '-w',
    '10',
    'device',
    'wifi',
    'connect',
    wifi.ssid,
    'password',
    password
  ]

  wifi.iface && args.push('ifname', wifi.iface)

  return {
    cmd: 'nmcli',
    args
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  const stdout = lines.join('\n')
  // Errors from nmcli came from stdout, we test presence of 'Error: ' string
  if (stdout.includes('Error: ')) {
    throw new Error(stdout.replace('Error: ', ''))
  }
}
