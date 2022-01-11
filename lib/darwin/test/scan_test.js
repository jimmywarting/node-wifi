import { assertEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts'
import * as mod from '../scan.js'

const shifted = `
                            SSID BSSID             RSSI CHANNEL HT CC SECURITY (auth/unicast/group)
                         NERMNET 18:ff:7b:43:b5:26 -64  149     Y  US WPA(PSK/TKIP,AES/TKIP) WPA2(PSK/TKIP,AES/TKIP)
            Linksys02787-invité 12:23:03:18:9f:1c -33  11      Y  US NONE
                    Linksys02787 10:23:03:1a:9f:1c -33  11      Y  US WPA2(PSK/AES/AES)
                         NERMNET 18:ff:7b:43:b5:27 -53  1,+1    Y  -- WPA2(PSK/TKIP,AES/TKIP)
`
const spaced = `
                            SSID BSSID             RSSI CHANNEL HT CC SECURITY (auth/unicast/group)
                    Linksys02787 10:23:03:1a:9f:1c -33  11      Y  US WPA2(PSK/AES/AES)
                      Terminus 1 1e:27:e2:fa:c6:32 -26  4       Y  -- WPA2(PSK/AES/AES)
               Linksys02787_5GHz 10:23:03:1a:9f:1d -51  36      Y  US WPA2(PSK/AES/AES)
`

const scan = `
                            SSID BSSID             RSSI CHANNEL HT CC SECURITY (auth/unicast/group)
                         foo-bar f6:d1:6d:b3:d2:88 -86  6       Y  ca WPA2(PSK/AES/AES)
                       VIRGO1732 c1:ee:0e:e4:fa:1f -86  36      Y  CA WPA2(PSK/AES/AES)
                         NERMNET 34:e8:94:1e:fc:5c -55  1       Y  -- WPA(PSK/AES,TKIP/TKIP) WPA2(PSK/AES,TKIP/TKIP)
                         NERMNET 45:ff:7b:43:b5:26 -64  149     Y  US WPA(PSK/TKIP,AES/TKIP) WPA2(PSK/TKIP,AES/TKIP)
`

const encode = str => str.split('\n').map(e => e.trim()).filter(Boolean)

Deno.test('calling `currentConnection.buildCmd()` returns a object', () => {
  const cmd = mod.buildCmd()
  assertEquals(typeof cmd, 'object')
})

Deno.test('parse macOS scan output', () => {
  const output = encode(scan)
  const networks = mod.parse(output)
  assertEquals(networks.length, 4)
  assertEquals(networks, [
    {
      bssid: 'f6:d1:6d:b3:d2:88',
      ssid: 'foo-bar',
      channel: 6,
      frequency: 2437,
      quality: 28,
      signalLevel: '-86',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    },
    {
      bssid: 'c1:ee:0e:e4:fa:1f',
      ssid: 'VIRGO1732',
      channel: 36,
      frequency: 5180,
      quality: 28,
      signalLevel: '-86',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    },
    {
      bssid: '34:e8:94:1e:fc:5c',
      ssid: 'NERMNET',
      channel: 1,
      frequency: 2412,
      quality: 90,
      signalLevel: '-55',
      security: 'WPA WPA2',
      securityFlags: ['(PSK/AES,TKIP/TKIP)', '(PSK/AES,TKIP/TKIP)']
    },
    {
      bssid: '45:ff:7b:43:b5:26',
      ssid: 'NERMNET',
      channel: 149,
      frequency: 5745,
      quality: 72,
      signalLevel: '-64',
      security: 'WPA WPA2',
      securityFlags: ['(PSK/TKIP,AES/TKIP)', '(PSK/TKIP,AES/TKIP)']
    }
  ])
})

Deno.test('should return wifi networks with shifted lines', () => {
  const output = encode(shifted)
  const networks = mod.parse(output)
  assertEquals(networks.length, 4)
  assertEquals(networks, [
    {
      bssid: '18:ff:7b:43:b5:26',
      ssid: 'NERMNET',
      channel: 149,
      frequency: 5745,
      quality: 72,
      signalLevel: '-64',
      security: 'WPA WPA2',
      securityFlags: ['(PSK/TKIP,AES/TKIP)', '(PSK/TKIP,AES/TKIP)']
    },
    {
      bssid: '12:23:03:18:9f:1c',
      ssid: 'Linksys02787-invité',
      channel: 11,
      frequency: 2462,
      quality: 134,
      signalLevel: '-33',
      security: 'NONE',
      securityFlags: []
    },
    {
      bssid: '10:23:03:1a:9f:1c',
      ssid: 'Linksys02787',
      channel: 11,
      frequency: 2462,
      quality: 134,
      signalLevel: '-33',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    },
    {
      bssid: '18:ff:7b:43:b5:27',
      ssid: 'NERMNET',
      channel: 1,
      frequency: 2412,
      quality: 94,
      signalLevel: '-53',
      security: 'WPA2',
      securityFlags: ['(PSK/TKIP,AES/TKIP)']
    }
  ])
})

Deno.test('should return wifi networks with space in ssid', () => {
  const output = encode(spaced)
  const networks = mod.parse(output)
  assertEquals(networks.length, 3)
  assertEquals(networks, [
    {
      bssid: '10:23:03:1a:9f:1c',
      ssid: 'Linksys02787',
      channel: 11,
      frequency: 2462,
      quality: 134,
      signalLevel: '-33',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    },
    {
      bssid: '1e:27:e2:fa:c6:32',
      ssid: 'Terminus 1',
      channel: 4,
      frequency: 2427,
      quality: 148,
      signalLevel: '-26',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    },
    {
      bssid: '10:23:03:1a:9f:1d',
      ssid: 'Linksys02787_5GHz',
      channel: 36,
      frequency: 5180,
      quality: 98,
      signalLevel: '-51',
      security: 'WPA2',
      securityFlags: ['(PSK/AES/AES)']
    }
  ])
})
