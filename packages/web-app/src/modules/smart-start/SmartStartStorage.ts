// Storage
import { getFullKey } from '../../Storage'

// Models
import { Blacklist } from '../machine/models/Blacklist'

export const getBlacklist = (key: string) => {
    const k = getFullKey(key)
    let blacklist = localStorage.getItem(k)

    return blacklist
        ? JSON.parse(blacklist)
        : null
}

export const setBlacklist = (key: string, payload: Blacklist[]) => {
    const k = getFullKey(key)
    let blacklist = JSON.stringify(payload)

    localStorage.setItem(k, blacklist)
}