export function buildCmd (option) {
  const args = ['wlan', 'disconnect']
  if (option.iface) args.push(`interface="${config.iface}"`)
  return {
    cmd: 'netsh',
    args
  }
}

/** @param {string[]} lines */
export function parse (lines) {

}
