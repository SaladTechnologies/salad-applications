export interface RewardSystemDetails {
  /** Processor details (eg. Intel Core 2 Duo 2.4GHz or AMD Athlon X2 5400+) */
  processor?: string

  /** Graphics card details (eg. AMD HD2600 or NVIDIA Geforce 8600) */
  graphics?: string

  /** Memory details, including units (eg. 2 GB RAM) */
  memory?: string

  /** Hard drive details, including units (eg. 5 GB) */
  diskSpace?: string

  /** Operating system details (eg. Windows Vista or Windows 7 64 bit) */
  os?: string

  /** Catchall for other system requirements */
  other?: string
}
