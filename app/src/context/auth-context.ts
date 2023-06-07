import auth from "@/lib/auth"
import { userDataStateType } from "@/rState/initialStates"
import React from "react"

interface contextInterface {
    appContextData?: {userData: userDataStateType, userSession: string},
    updateContext?: () => void
}
export const user = {
    appContextData: {},
    updateContext: () => {}
} as contextInterface

export const AuthContext = React.createContext(user)