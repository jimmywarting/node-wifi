/**
 * @param {import('../wifi.js').default} wifi
 * @param {string} password
 */
export function buildCmd (wifi, password) {
  return {
    cmd: '/usr/sbin/networksetup',
    args: [
      '-setairportnetwork',
      wifi.iface || 'en0',
      wifi.ssid,
      password
    ]
  }
}

/** @param {string[]} lines */
export function parse (stdout) {
  console.log(stdout)
}
