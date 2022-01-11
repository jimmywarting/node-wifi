/** @param {import('../wifi.js').default} wifi */
export function buildCmd (wifi) {
  return {
    cmd: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport',
    args: [
      wifi.bssid,
      '-z'
    ]
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  //
}
