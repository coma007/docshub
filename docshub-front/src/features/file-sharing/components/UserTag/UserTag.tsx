import React from 'react'
import FileSharingService from '../../services/FileSharingService'
import { Permission } from '../../types/Permission'
import UserTagCSS from "./UserTag.module.css"

const UserTag = (props: { permission: Permission }) => {
    return (
        <span className={UserTagCSS.tag}>
            {props.permission.username}
            <button className={UserTagCSS.remove}
                onClick={() => FileSharingService.remove_permission(props.permission)}
            >✖</button>
        </span>
    )
}

export default UserTag