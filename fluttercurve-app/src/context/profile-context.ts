import React from "react"

interface contextInterface {
    profileDataContext?: {userProfile:string},
    updateProfileContext?: (arg0: any) => void
}
export const user = {
    profileDataContext: {},
    //@ts-ignore
    updateProfileContext: (data = null) => {}
} as contextInterface

export const ProfileContext = React.createContext(user)