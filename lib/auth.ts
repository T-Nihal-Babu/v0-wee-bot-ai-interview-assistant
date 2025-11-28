// Authentication utilities for WeeBot

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

const USERS_STORAGE_KEY = "weebot_users"
const CURRENT_USER_KEY = "weebot_current_user"

export function registerUser(username: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getAllUsers()

  if (users.some((u) => u.email === email)) {
    return { success: false, error: "Email already registered" }
  }

  if (users.some((u) => u.username === username)) {
    return { success: false, error: "Username already taken" }
  }

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    createdAt: new Date().toISOString(),
  }

  users.push({ ...newUser, password } as any)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  setCurrentUser(newUser)
  return { success: true }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email && (u as any).password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  const { password: _, ...userWithoutPassword } = user as any
  setCurrentUser(userWithoutPassword as User)
  return { success: true, user: userWithoutPassword as User }
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function logoutUser() {
  setCurrentUser(null)
}

function getAllUsers(): User[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}
