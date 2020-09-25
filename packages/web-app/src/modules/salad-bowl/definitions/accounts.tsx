export interface Accounts {
  ethermine: {
    address: string
    workerId: string
  }
  flypoolBeam: {
    address: string
    workerId: string
  }
  nicehash: {
    address: string
    rigId: string
  }
}

export const BEAM_WALLET_ADDRESS = '36e4970859cdebbd36e0419ad35b49954e4b6eeac2f990ca1860a9c03a342350363'

export const ETH_WALLET_ADDRESS = '0x6ff85749ffac2d3a36efa2bc916305433fa93731'

export const NICEHASH_MINING_ADDRESSES = [
  '368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J',
  '3LHpkPBNRwXhJ7ttGYD5ToWmGgQ1PE7zGe',
  '3JgjH5V3mT56F3kqCjLTzqirZz8ei9cNH5',
  '373Ee6DSDgAYNAVSnfgUV99248L6Ab7aUH',
  '3F8eMXyShK8d1dZFtBr13hcAHMMGJDKDSM',
  '33kJvAUL3Na2ifFDGmUPsZLTyDUBGZLhAi',
  '3N1wxx2YQrvobXJtpz7Js5h5zNqx2qo7H6',
  '3HhmgyAvpEN6MmFXDXCLNQfG4YxWMicBcV',
  '3FSqW1MFAdzekG6DdvfUhPVnwVY4C9zBAG',
  '3PtshxjizK6FbdH8WLP8duuSCJuGgBxzwy',
]

export const getNiceHashMiningAddress = (machineId: string): string => {
  let uuidHashCode = 0
  for (let i = 0; i < machineId.length; i++) {
    uuidHashCode = (Math.imul(31, uuidHashCode) + machineId.charCodeAt(i)) | 0
  }

  const partition = Math.abs(uuidHashCode) % NICEHASH_MINING_ADDRESSES.length
  return NICEHASH_MINING_ADDRESSES[partition]
}
