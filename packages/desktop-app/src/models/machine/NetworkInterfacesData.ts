/** Taken from si.networkInterfaceDefault of SystemInformation */
export interface NetworkInterfacesData {
  iface: string
  ifaceName: string
  ip4: string
  ip6: string
  mac: string
  internal: boolean
  virtual: boolean
  operstate: string
  type: string
  duplex: string
  mtu: number
  speed: number
  carrier_changes: number
}
