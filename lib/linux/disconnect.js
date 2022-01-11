/** @param {{ iface: string; }} option */
export function buildCmd (option) {
  return {
    cmd: 'nmcli',
    args: [
      'device',
      'disconnect',
      option.iface
    ].filter(Boolean)
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  console.log(lines)
}
