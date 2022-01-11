import { assertEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts'
import * as mod from '../scan.js'

const stdout = `
no:Linksys01777:31\\:23\\:03\\:1A\\:9F\\:1C:Infra:11:2462 MHz:100:WPA2:(none):pair_ccmp group_ccmp psk
no:Linksys01777-invité:31\\:23\\:03\\:18\\:9F\\:1C:Infra:11:2462 MHz:100::(none):(none)
no:EBOX_6070:00\\:21\\:6A\\:75\\:60\\:22:Infra:11:2462 MHz:100:WPA1 WPA2:pair_tkip pair_ccmp group_tkip psk:pair_tkip pair_ccmp group_tkip psk
yes:Linksys01777_5GHz:31\\:23\\:03\\:1A\\:9F\\:1D:Infra:36:5180 MHz:75:WPA2:(none):pair_ccmp group_ccmp psk
no:NERMNET:61\\:FF\\:7B\\:43\\:B5\\:27:Infra:1:2412 MHz:64:WPA2:(none):pair_tkip pair_ccmp group_tkip psk
no:NERMNET:61\\:FF\\:7B\\:43\\:B5\\:26:Infra:149:5745 MHz:64:WPA1 WPA2:pair_tkip pair_ccmp group_tkip psk:pair_tkip pair_ccmp group_tkip psk
no:VIRGIN172:B1\\:EE\\:0E\\:E4\\:FA\\:1E:Infra:6:2437 MHz:62:WPA2:(none):pair_ccmp group_ccmp psk
no:NERMNET:91\\:48\\:27\\:4B\\:7C\\:5A:Infra:13:2472 MHz:55:WPA1 WPA2:pair_tkip pair_ccmp group_tkip psk:pair_tkip pair_ccmp group_tkip psk
no:VIRGIN660:D1\\:D7\\:75\\:A2\\:BC\\:F6:Infra:6:2437 MHz:54:WPA2:(none):pair_ccmp group_ccmp psk
no:VIDEOTRON9021:A1\\:E4\\:CB\\:FB\\:42\\:38:Infra:11:2462 MHz:40:WPA2:(none):pair_ccmp group_ccmp psk
no:BELL320:A1\\:6A\\:BB\\:E9\\:FC\\:E7:Infra:44:5220 MHz:30:WPA2:(none):pair_ccmp group_ccmp psk
no:BELL320:A1\\:6A\\:BB\\:E9\\:FC\\:E5:Infra:100:5500 MHz:30:WPA2:(none):pair_ccmp group_ccmp psk
no::A1\\:6A\\:BB\\:E9\\:FC\\:E5:Infra:100:5500 MHz:30:WPA2:(none):pair_ccmp group_ccmp psk
no:BELL320:A1\\:6A\\:BB\\:E9\\:FC\\:E6:Infra:1:2412 MHz:25:WPA2:(none):pair_ccmp group_ccmp psk
`

const encode = str => str.split('\n').map(e => e.trim()).filter(Boolean)

Deno.test('parse macOS scan output', () => {
  const output = encode(stdout)
  const networks = mod.parse(output)
  const expected = [
    {
      ssid: 'Linksys01777',
      bssid: '31:23:03:1A:9F:1C',
      mode: 'Infra',
      channel: 11,
      frequency: 2462,
      signalLevel: -50,
      quality: 100,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'Linksys01777-invité',
      bssid: '31:23:03:18:9F:1C',
      mode: 'Infra',
      channel: 11,
      frequency: 2462,
      signalLevel: -50,
      quality: 100,
      security: '',
      securityFlags: { wpa: '(none)', rsn: '(none)' }
    },
    {
      ssid: 'EBOX_6070',
      bssid: '00:21:6A:75:60:22',
      mode: 'Infra',
      channel: 11,
      frequency: 2462,
      signalLevel: -50,
      quality: 100,
      security: 'WPA1 WPA2',
      securityFlags: {
        wpa: 'pair_tkip pair_ccmp group_tkip psk',
        rsn: 'pair_tkip pair_ccmp group_tkip psk'
      }
    },
    {
      ssid: 'Linksys01777_5GHz',
      bssid: '31:23:03:1A:9F:1D',
      mode: 'Infra',
      channel: 36,
      frequency: 5180,
      signalLevel: -62.5,
      quality: 75,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'NERMNET',
      bssid: '61:FF:7B:43:B5:27',
      mode: 'Infra',
      channel: 1,
      frequency: 2412,
      signalLevel: -68,
      quality: 64,
      security: 'WPA2',
      securityFlags: {
        wpa: '(none)',
        rsn: 'pair_tkip pair_ccmp group_tkip psk'
      }
    },
    {
      ssid: 'NERMNET',
      bssid: '61:FF:7B:43:B5:26',
      mode: 'Infra',
      channel: 149,
      frequency: 5745,
      signalLevel: -68,
      quality: 64,
      security: 'WPA1 WPA2',
      securityFlags: {
        wpa: 'pair_tkip pair_ccmp group_tkip psk',
        rsn: 'pair_tkip pair_ccmp group_tkip psk'
      }
    },
    {
      ssid: 'VIRGIN172',
      bssid: 'B1:EE:0E:E4:FA:1E',
      mode: 'Infra',
      channel: 6,
      frequency: 2437,
      signalLevel: -69,
      quality: 62,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'NERMNET',
      bssid: '91:48:27:4B:7C:5A',
      mode: 'Infra',
      channel: 13,
      frequency: 2472,
      signalLevel: -72.5,
      quality: 55,
      security: 'WPA1 WPA2',
      securityFlags: {
        wpa: 'pair_tkip pair_ccmp group_tkip psk',
        rsn: 'pair_tkip pair_ccmp group_tkip psk'
      }
    },
    {
      ssid: 'VIRGIN660',
      bssid: 'D1:D7:75:A2:BC:F6',
      mode: 'Infra',
      channel: 6,
      frequency: 2437,
      signalLevel: -73,
      quality: 54,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'VIDEOTRON9021',
      bssid: 'A1:E4:CB:FB:42:38',
      mode: 'Infra',
      channel: 11,
      frequency: 2462,
      signalLevel: -80,
      quality: 40,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'BELL320',
      bssid: 'A1:6A:BB:E9:FC:E7',
      mode: 'Infra',
      channel: 44,
      frequency: 5220,
      signalLevel: -85,
      quality: 30,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'BELL320',
      bssid: 'A1:6A:BB:E9:FC:E5',
      mode: 'Infra',
      channel: 100,
      frequency: 5500,
      signalLevel: -85,
      quality: 30,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: '',
      bssid: 'A1:6A:BB:E9:FC:E5',
      mode: 'Infra',
      channel: 100,
      frequency: 5500,
      signalLevel: -85,
      quality: 30,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    },
    {
      ssid: 'BELL320',
      bssid: 'A1:6A:BB:E9:FC:E6',
      mode: 'Infra',
      channel: 1,
      frequency: 2412,
      signalLevel: -87.5,
      quality: 25,
      security: 'WPA2',
      securityFlags: { wpa: '(none)', rsn: 'pair_ccmp group_ccmp psk' }
    }
  ]

  assertEquals(networks, expected)
})
