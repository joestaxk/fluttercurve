import auth from "@/lib/auth"
import React from "react"

export const user = {
    fullName: '',
    userName: '',
    email: '',
    isAdmin: null
}

export const AuthContext = React.createContext(user, )