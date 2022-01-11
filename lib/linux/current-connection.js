import { dBFromQuality } from '../utils/network-quality.js'

/** @param {{ iface: string; }} options */
export function buildCmd (options) {
  const args = [
    '--terse',
    '--fields',
    'active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags,device',
    'device',
    'wifi'
  ]

  options.iface && args.push('list', 'ifname', options.iface)

  return {
    cmd: 'nmcli',
    args
  }
}

/** @param {string[]} lines */
export function parse (lines) {
  const networks = []
  for (let i = 0; i < lines.length; i++) {
    const fields = lines[i].replace(/\\:/g, '&&').split(':')
    if (fields[0] == 'yes') {
      networks.push({
        iface: fields[10].replace(/&&/g, ':'),
        ssid: fields[1].replace(/&&/g, ':'),
        bssid: fields[2].replace(/&&/g, ':'),
        mode: fields[3].replace(/&&/g, ':'),
        channel: parseInt(fields[4].replace(/&&/g, ':')),
        frequency: parseInt(fields[5].replace(/&&/g, ':')),
        signalLevel: dBFromQuality(
          fields[6].replace(/&&/g, ':')
        ),
        quality: parseFloat(fields[6].replace(/&&/g, ':')),
        security: fields[7].replace(/&&/g, ':'),
        securityFlags: {
          wpa: fields[8].replace(/&&/g, ':'),
          rsn: fields[9].replace(/&&/g, ':')
        }
      })
    }
  }
}
