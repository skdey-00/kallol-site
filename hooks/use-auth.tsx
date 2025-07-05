"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  membershipType: "life" | "executive" | "volunteer"
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock database of users
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@kallol.org",
    password: "admin123",
    name: "Kallol Admin",
    membershipType: "life",
    joinDate: "1985-01-01",
  },
  {
    id: "2",
    email: "member@kallol.org",
    password: "member123",
    name: "Rajesh Chatterjee",
    membershipType: "life",
    joinDate: "1990-05-15",
  },
  {
    id: "3",
    email: "executive@kallol.org",
    password: "executive123",
    name: "Priya Banerjee",
    membershipType: "executive",
    joinDate: "2010-03-20",
  },
  {
    id: "4",
    email: "life@kallol.org",
    password: "life123",
    name: "Subhash Bose",
    membershipType: "life",
    joinDate: "1995-08-10",
  },
  {
    id: "5",
    email: "volunteer@kallol.org",
    password: "volunteer123",
    name: "Anjali Das",
    membershipType: "volunteer",
    joinDate: "2023-01-01",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("kallol_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("kallol_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kallol_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
