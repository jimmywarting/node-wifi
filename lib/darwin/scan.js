import { frequencyFromChannel, qualityFromDB } from '../utils/network-quality.js'

/**
 * @param {string} security
 */
const parseSecurity = security => {
  const securities =
    security === 'NONE'
      ? [{ protocole: 'NONE', flag: '' }]
      : security
        .split(' ')
        .map(s => s.match(/(.*)\((.*)\)/))
        .filter(Boolean)
        .map(([, protocole, flag]) => ({
          protocole,
          flag
        }))

  return {
    security: securities.map(s => s.protocole).join(' '),
    securityFlags: securities.filter(s => s.flag).map(s => `(${s.flag})`)
  }
}

export function buildCmd () {
  const cmd = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
  const args = ['--scan']
  return { cmd, args }
}

/** @param {string[]} lines */
export function parse (lines) {
  const regex = /(.*)\s+([a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2})\s+(-[0-9]+)\s+([0-9]+).*\s+([A-Z]+)\s+([a-zA-Z-]+)\s+([A-Z0-9(,)\s/]+)/
  const networks = []

  for (const line of lines) {
    const match = line.match(regex)
    if (match) {
      const [
        ,
        ssid,
        bssid,
        rssi,
        channelStr,
        ht,
        countryCode,
        security
      ] = match
      const channel = parseInt(channelStr)
      networks.push({
        bssid,
        ssid,
        channel,
        frequency: frequencyFromChannel(channel),
        signalLevel: rssi,
        quality: qualityFromDB(rssi),
        ...parseSecurity(security)
      })
    }
  }

  return networks
}
