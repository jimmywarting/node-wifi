/** @param {{ ssid: string; }} option */
export function buildCmd (option) {
  const args = [
    'connection',
    'delete',
    'id',
    option.ssid
  ]
  return { cmd: 'nmcli', args }
}

/** @param {string[]} lines */
export function parse (lines) {
  console.log(lines)
}
