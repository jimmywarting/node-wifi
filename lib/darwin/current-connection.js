import { frequencyFromChannel, qualityFromDB } from '../utils/network-quality.js'

/** @param {string} mac */
const formatMacAddress = mac => mac
  .split(':')
  .map(part => part.padStart(2, '0'))
  .join(':')
  .toLowerCase()

export function buildCmd () {
  const cmd = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
  const args = ['--getinfo']
  return { cmd, args }
}

/** @param {string[]} lines */
export function parse (lines) {
  /** @type {Object<string, string>} */
  const info = Object.fromEntries(
    lines.map(line => line.split(': '))
  )
    console.log(info)
  const signalLevel = parseInt(info.agrCtlRSSI)
  const bssid = formatMacAddress(info.BSSID)
  const quality = qualityFromDB(signalLevel)
  const ssid = info.SSID
  const security = info['link auth']
  const channel = info.channel
  const frequency = frequencyFromChannel(parseInt(channel))

  const connection = {
    signalLevel,
    quality,
    bssid,
    ssid,
    securityFlags: [],
    security,
    channel,
    frequency
  }

  return [connection]
}
