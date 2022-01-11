import * as networkUtils from '../utils/network-utils.js'

export function buildCmd (options) {
  return {
    cmd: 'netsh',
    args: ['wlan', 'show', 'networks', 'mode=Bssid']
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  let numNetworks = -1
  let currentLine = 0
  let networkTmp
  const networksTmp = []
  let network
  const networks = []
  let i

  for (i = 0; i < lines.length; i++) {
    numNetworks++
    networkTmp = lines.slice(currentLine, i)
    networksTmp.push(networkTmp)
    currentLine = i + 1
  }

  for (i = 0; i < numNetworks; i++) {
    // skip empty networks
    if (networksTmp[i] && networksTmp[i].length > 0) {
      network = parse(networksTmp[i])
      networks.push(network)
    }
  }
}
function parseSection (networkTmp) {
  const network = {}

  network.mac = networkTmp[4] ? networkTmp[4].match(/.*?:\s(.*)/)[1] : ''
  network.bssid = network.mac
  network.ssid = networkTmp[0] ? networkTmp[0].match(/.*?:\s(.*)/)[1] : ''
  network.channel = networkTmp[7]
    ? parseInt(networkTmp[7].match(/.*?:\s(.*)/)[1])
    : -1
  network.frequency = network.channel
    ? parseInt(networkUtils.frequencyFromChannel(network.channel))
    : 0
  network.signalLevel = networkTmp[5]
    ? networkUtils.dBFromQuality(networkTmp[5].match(/.*?:\s(.*)/)[1])
    : Number.MIN_VALUE
  network.quality = networkTmp[5]
    ? parseFloat(networkTmp[5].match(/.*?:\s(.*)/)[1])
    : 0
  network.security = networkTmp[2] ? networkTmp[2].match(/.*?:\s(.*)/)[1] : ''
  network.securityFlags = networkTmp[3]
    ? networkTmp[3].match(/.*?:\s(.*)/)[1]
    : ''
  network.mode = 'Unknown'

  return network
}
