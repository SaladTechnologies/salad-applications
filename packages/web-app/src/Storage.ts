export const getKey = (key: string) => 'SALAD_' + key.toUpperCase()

export const getItem = (key: string) => localStorage.getItem(getKey(key))

export const getOrDefault = (key: string, fallback: string) => {
  let item = localStorage.getItem(getKey(key))
  if (item == null) {
    item = fallback
    localStorage.setItem(getKey(key), item)
  }
  return item
}
