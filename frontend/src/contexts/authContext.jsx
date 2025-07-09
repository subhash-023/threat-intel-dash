import { useState, useEffect, useContext, createContext } from "react";
const base_url = import.meta.env.VITE_API_BASE_URL

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        verifyToken()
    }, [])

    const verifyToken = async () => {
        try {
            const response = await fetch(`${base_url}/auth/verify-token`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data)
            } else if ([401, 403].includes(response.status)) {
                setUser(null)
            } else {
                console.error("Unexpected Token verification failure", response.status)
                setUser(null)
            }
        } catch (error) {
            console.error(error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await fetch(`${base_url}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            if (response.ok) {
                verifyToken()
                return null
            }
            const errorMessage = await response.json()
            return errorMessage.error || "Login failed, please try again"
        } catch (error) {
            console.error(error)
            return ("An unexpected error occurred, please try again")
        }
    }

    const register = async (email, password) => {
        try {
            const response = await fetch(`${base_url}/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            })
            if(response.ok){
                return null
            }
            const errorMessage = await response.json()
            return errorMessage || "Registration failed, please try again"
        } catch (error) {
            console.error(error)
            return ("An unexpected error occurred, please try again")
        }
    }

    const logout = async () => {
        try {
            const response = await fetch(`${base_url}/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
            if(response.ok){
                setUser(null)
                return null
            }
            const errorData = await response.json()
            return errorData
        } catch (error) {
            console.error(error)
            return "An unexpected error occurred during logout"
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}