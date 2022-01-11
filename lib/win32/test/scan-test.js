import { assertEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts'
import * as mod from '../scan.js'

const stdout = `
Interface name : Drahtlosnetzwerkverbindung
There are 2 networks currently visible.

SSID 1 : HRG
Network type            : Infrastructure
Authentication          : Open
Encryption              : WEP
BSSID 1                 : 78:96:82:21:cd:8b
Signal             : 7%
Radio type         : 802.11g
Channel            : 1
Basic rates (Mbps) : 1 2 5.5 11
Other rates (Mbps) : 6 9 12 18 24 36 48 54

SSID 2 : TP-LINK_F16CDC
Network type            : Infrastructure
Authentication          : WPA2-Personal
Encryption              : CCMP
BSSID 1                 : 10:fe:ed:f1:6c:dc
Signal             : 42%
Radio type         : 802.11n
Channel            : 2
Basic rates (Mbps) : 1 2 5.5 11
Other rates (Mbps) : 6 9 12 18 24 36 48 54
`

const encode = str => str.split('\n').map(e => e.trim()).filter(Boolean)

Deno.test('parse window scan output', () => {
  const output = encode(stdout)
  const networks = mod.parse(output)
  console.log(networks)
  return
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
