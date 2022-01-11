/** @param {import('../wifi.js').default} wifi */
export function buildCmd (wifi) {
  return {
    cmd: '/usr/sbin/networksetup',
    args: [
      '-removepreferredwirelessnetwork',
      wifi.iface || 'en0',
      wifi.ssid
    ]
  }
}
/** @param {string[]} lines */
export function parse (lines) {
  //
}
