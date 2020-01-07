export const getFullKey = (key: string) => 'SALAD_' + key.toUpperCase()

export const getItem = (key: string) => localStorage.getItem(getFullKey(key))

export const getOrSetDefault = (key: string, fallback: string) => {
  let k = getFullKey(key)
  let item = localStorage.getItem(k)
  if (item === null) {
    item = fallback
    localStorage.setItem(k, item)
  }
  return item
}

export const getOrSetDefaultCallback = (key: string, fallback: () => string) => {
  let k = getFullKey(key)
  let item = localStorage.getItem(k)
  if (item === null) {
    item = fallback()
    localStorage.setItem(k, item)
  }
  return item
}

export const setItem = (key: string, value: string | boolean | number) => {
  localStorage.setItem(getFullKey(key), String(value))
}

export const removeItem = (key: string) => {
  localStorage.removeItem(getFullKey(key))
}
