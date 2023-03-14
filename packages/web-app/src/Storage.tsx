const getFullKey = (key: string) => 'SALAD_' + key.toUpperCase()

export const getItem = (key: string) => localStorage.getItem(getFullKey(key))

export const setItem = (key: string, value: string | boolean | number) => {
  localStorage.setItem(getFullKey(key), String(value))
}
