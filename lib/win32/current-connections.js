import * as networkUtils from '../utils/network-utils.js'

/** @param {string[]} lines */
export function parse (lines) {
  const connections = []
  let i = 3
  while (lines.length > i + 18) {
    const tmpConnection = {}
    const fields = [
      'name',
      'description',
      'guid',
      'mac',
      'state',
      'ssid',
      'bssid',
      'mode',
      'radio',
      'authentication',
      'encryption',
      'connection',
      'channel',
      'reception',
      'transmission',
      'signal',
      'profil'
    ]
    for (let j = 0; j < fields.length; j++) {
      const line = lines[i + j]
      tmpConnection[fields[j]] = line.match(/.*: (.*)/)[1]
    }

    connections.push({
      iface: tmpConnection.name,
      ssid: tmpConnection.ssid,
      bssid: tmpConnection.bssid,
      mac: tmpConnection.bssid,
      mode: tmpConnection.mode,
      channel: parseInt(tmpConnection.channel),
      frequency: parseInt(
        networkUtils.frequencyFromChannel(parseInt(tmpConnection.channel))
      ),
      signalLevel: networkUtils.dBFromQuality(tmpConnection.signal),
      quality: parseFloat(tmpConnection.signal),
      security: tmpConnection.authentication,
      securityFlags: tmpConnection.encryption
    })

    i = i + 18
  }

  return connections
}

export function buildCmd () {
  return {
    cmd: 'netsh',
    args: ['wlan', 'show', 'interfaces']
  }
}
