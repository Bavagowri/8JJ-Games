export const isBrowser = typeof window !== 'undefined'
export const safeLocalStorage = {
  getItem: (key) => isBrowser ? localStorage.getItem(key) : null,
  setItem: (key, val) => isBrowser && localStorage.setItem(key, val),
  removeItem: (key) => isBrowser && localStorage.removeItem(key),
}
export const safeSessionStorage = {
  getItem: (key) => isBrowser ? sessionStorage.getItem(key) : null,
  setItem: (key, val) => isBrowser && sessionStorage.setItem(key, val),
}
export const safeWindow = {
  location: { origin: isBrowser ? window.location.origin : '', href: isBrowser ? window.location.href : '', search: isBrowser ? window.location.search : '' },
  innerWidth: isBrowser ? window.innerWidth : 0,
  innerHeight: isBrowser ? window.innerHeight : 0,
}
