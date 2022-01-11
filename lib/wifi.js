import {platform} from 'node:process'
import executer from './utils/executer.js'

const arc = {
  aix: 'unknown',
  darwin: 'darwin',
  freebsd: 'unknown',
  linux: 'linux',
  openbsd: 'unknown',
  sunos: 'unknown',
  win32: 'win32'
}[platform]

export default class WiFi {
  /** @type {string} */
  bssid = null
  /** @type {string} */
  ssid = null
  /** @type {number} */
  channel = null
  /** @type {number} */
  frequency = null
  /** @type {number} */
  signalLevel = null
  /** @type {number} */
  quality = null
  /** @type {string} */
  security = null
  /** @type {string[]} */
  securityFlags = null

  /** @return {Promise<WiFi[]>} */
  static async scan () {
    const m = await import(`./${arc}/scan.js`)
    const c = await executer(m.buildCmd()).then(m.parse)
    return c.map(c => new WiFi(c))
  }

  /** @return {Promise<WiFi[]>} */
  static async currentConnection () {
    const m = await import(`./${arc}/current-connection.js`)
    const c = await executer(m.buildCmd()).then(m.parse)
    return c.map(c => new WiFi(c))
  }

  constructor (c) {
    Object.assign(this, c)
  }

  /** Disconnect from the network. */
  async disconnect () {
    const m = await import(`./${arc}/disconnect.js`)
    await executer(m.buildCmd(this)).then(m.parse)
  }

  /** Delete (forget) the network */
  async delete () {
    const m = await import(`./${arc}/delete.js`)
    await executer(m.buildCmd(this)).then(m.parse)
  }

  /**
   * Connect to the network.
   * @param {string} password
   */
  async connect (password) {
    const m = await import(`./${arc}/connect.js`)
    await executer(m.buildCmd(this, password)).then(m.parse)
  }
}

const networks = await WiFi.scan()
const current = await WiFi.currentConnection()
console.log(current)
// current[0].ssid === myNetwork.ssid)
// await myNetwork.delete()
// await myNetwork.disconnect()
// await myNetwork.connect('sbmz28b5zrhq')
