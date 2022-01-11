import { dBFromPercentage } from '../utils/percentage-db.js'

/** @param {{ iface: string; }} option */
export function buildCmd (option) {
  const args = [
    '--terse',
    '--fields',
    'active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags',
    'device',
    'wifi',
    'list'
  ]

  option.iface && args.push('ifname', option.iface)

  return {
    cmd: 'nmcli',
    args
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  return lines
    .filter(line => line !== '' && line.includes(':'))
    .filter(line => matchBssid(line))
    .map(line => {
      const match = matchBssid(line)
      const bssid = match[0].replace(/\\:/g, ':')
      const fields = line.replace(match[0]).split(':')

      const [
        // eslint-disable-next-line no-unused-vars
        active,
        ssid,
        // eslint-disable-next-line no-unused-vars
        bssidAlreadyProcessed,
        mode,
        channel,
        frequency,
        quality,
        security,
        securityFlags_wpa,
        securityFlags_rsn
      ] = fields

      return {
        ssid,
        bssid,
        mode,
        channel: parseInt(channel),
        frequency: parseInt(frequency),
        signalLevel: dBFromPercentage(quality),
        quality: parseInt(quality),
        security: security !== '(none)' ? security : 'none',
        securityFlags: {
          wpa: securityFlags_wpa,
          rsn: securityFlags_rsn
        }
      }
    })
}

const matchBssid = line => line.match(
  /[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}/
)
