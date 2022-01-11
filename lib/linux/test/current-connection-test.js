import { assertEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts'
import * as mod from '../current-connection.js'

// $ /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport --getinfo
const info = `
     agrCtlRSSI: -50
     agrExtRSSI: 0
    agrCtlNoise: -92
    agrExtNoise: 0
          state: running
        op mode: station
     lastTxRate: 650
        maxRate: 867
lastAssocStatus: 0
    802.11 auth: open
      link auth: wpa2-psk
          BSSID: 31:23:3:1a:9f:1d
           SSID: Linksys01227_5GHz
            MCS: 7
        channel: 36,80
`

const encode = str => str.split('\n').map(e => e.trim()).filter(Boolean)

Deno.test('parse linux scan output', () => {
  const output = encode(info)
  const networks = mod.parse(output)
  assertEquals(networks.length, 1)
  assertEquals(networks, [
    {
      bssid: '31:23:03:1a:9f:1d',
      ssid: 'Linksys01227_5GHz',
      channel: '36,80',
      frequency: 5180,
      quality: 100,
      signalLevel: -50,
      security: 'wpa2-psk',
      securityFlags: []
    }
  ])
})
