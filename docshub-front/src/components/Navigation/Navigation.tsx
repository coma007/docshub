import { Button, Image, useAuthenticator } from '@aws-amplify/ui-react'
import React from 'react'
import NavigationCSS from "./Navigation.module.css"

const Navigation = (props: { option: string, changeOption: any }) => {
    const { signOut } = useAuthenticator((context) => [context.signOut])

    return (
        <div className={NavigationCSS.bar}>
            <div className={NavigationCSS.left}>
                <Image className={NavigationCSS.logo} alt="logo" src="logo.png" />
                <span>
                    <Button
                        className={`${NavigationCSS.margin} ${props.option == "owned" && NavigationCSS.active}`}
                        onClick={() => { if (props.option != "owned") props.changeOption("owned") }}>
                        My files
                    </Button>
                    <Button
                        className={`${props.option == "shared" && NavigationCSS.active}`}
                        onClick={() => { if (props.option != "shared") props.changeOption("shared") }}>
                        Shared files
                    </Button>
                </span>
            </div>
            <div className={NavigationCSS.logout}>
                <Button onClick={signOut}>Sign out</Button>
            </div>
        </div>
    )
}

export default Navigation