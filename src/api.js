import { UserModel } from "./data"

const API_BASE_URL = process.env.REACT_APP_BACK_URL || "http://localhost:8000"

async function get(path) {
  const response = await fetch(API_BASE_URL + path, {
    method: 'GET',
    headers: {
      'X-USER-ID': window.localStorage.getItem('X-USER-ID'),
    }
  })

  const result = await response.json()
  console.debug("GET", path, result)
  return result
}

export function getUserId() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

  if (tgUser || process.env.NODE_ENV === "production") {
    return parseInt(tgUser.id)
  } else {
    return parseInt(window.localStorage.getItem("id"))
  }
}

async function post(path, data) {
  const response = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-USER-ID': window.localStorage.getItem('X-USER-ID'),
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  console.debug("POST", path, data, result)
  return result
}

export async function login() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  const data = {}

  const friendId = parseInt(window.localStorage.getItem("friendId"))
  data.friendId = friendId

  if (tgUser || process.env.NODE_ENV === "production") {
    data.id = tgUser.id
    data.username = tgUser.username
    data.first_name = tgUser.first_name
    data.last_name = tgUser.last_name
    data.language_code = tgUser.language_code
    data.allows_write_to_pm = tgUser.allows_write_to_pm
    data.is_premium = tgUser.is_premium
  } else {
    data.id = getUserId()
    data.username = window.localStorage.getItem("username")
    data.first_name = window.localStorage.getItem("first_name")
    data.last_name = window.localStorage.getItem("last_name")
    data.language_code = window.localStorage.getItem("language_code")
    data.allows_write_to_pm = window.localStorage.getItem("allows_write_to_pm")
    data.is_premium = window.localStorage.getItem("is_premium")
  }

  if (!data.id) {
    throw Error(`Error loading Telegram.WebApp`)
  }

  window.localStorage.setItem('X-USER-ID', data.id)
  return new UserModel(await post("/login", data))
}

export async function getTokenDetails(chain, addr) {
  return await get(`/token/${chain}/${addr}`)
}