import { Button, Image, useAuthenticator } from '@aws-amplify/ui-react'
import React from 'react'
import NavigationCSS from "./Navigation.module.css"

const Navigation = () => {
    const { signOut } = useAuthenticator((context) => [context.signOut])

    return (
        <div className={NavigationCSS.bar}>
            <div>
                <Image className={NavigationCSS.logo} alt="logo" src="logo.png" />
            </div>
            <div className={NavigationCSS.logout}>
                <Button onClick={signOut}>Sign out</Button>
            </div>
        </div>
    )
}

export default Navigation