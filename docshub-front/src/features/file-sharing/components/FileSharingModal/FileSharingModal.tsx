import { Button, Collection, ScrollView, Text, TextField } from '@aws-amplify/ui-react'
import Modal from "react-modal"
import FileSharingModalCSS from "./FileSharingModal.module.css"
import { useEffect, useState } from 'react'
import { TagsInput } from 'react-tag-input-component'
import FileSharingService from '../../services/FileSharingService'
import UserTag from '../UserTag/UserTag'
import { Permission } from '../../types/Permission'

const FileSharingModal = (props: { isOpenModal: boolean, closeModal: any, selectedFile: any }) => {

    const [users, setUsers] = useState<Permission[]>([]);

    useEffect(() => {
        if (props.selectedFile !== undefined)
            fetchUsers()
    }, [props.selectedFile])


    const fetchUsers = () => {
        FileSharingService.get_users_with_access(props.selectedFile)
            .then(result => {
                setUsers(result)
            }
            )
    }

    const [usernames, setUsernames] = useState<string[]>([]);

    const handleTagsChange = (emails: any) => {
        setUsernames(emails)
    }

    const proccessData = async () => {

    }

    const onSubmit = async () => {
        proccessData();
    }

    const getItemName = (path: string) => {
        if (path == undefined) {
            return ""
        }
        let type = "file"
        let segments = path.split("/")
        if (segments.at(-1) == "") {
            type = "album"
        }
        segments.shift()
        return type + " '" + segments.join("/") + "'"
    }

    Modal.setAppElement('#root')
    return (
        <Modal style={{
            content: {
                width: '65%',
                height: `80%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px',
            },
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }
        }}
            isOpen={props.isOpenModal}
            onRequestClose={props.closeModal}
        >
            <div className={FileSharingModalCSS.window}>
                <button className={FileSharingModalCSS.close}
                    onClick={props.closeModal}
                >✖</button>
                <h2>Share <span className={FileSharingModalCSS.accent}>{getItemName(props.selectedFile)}</span></h2>
                <Text>Note that by sharing item, you give other users read-access only. </Text>
                <TagsInput
                    value={usernames}
                    onChange={handleTagsChange}
                    placeHolder="Add users..."
                />
                <Button onClick={onSubmit} className={FileSharingModalCSS.submit}>Share</Button>
                <div className={FileSharingModalCSS.permissions}>
                    <Text className={FileSharingModalCSS.title}>Users that already have access to this item: </Text>
                    <ScrollView className={FileSharingModalCSS.scroll}>
                        <Collection
                            items={users}
                            type="grid"
                            templateColumns="1fr 1fr 1fr 1fr"
                            rowGap="15px"
                        >{(item, index) => <>
                            <UserTag permission={item}></UserTag>
                        </>
                            }
                        </Collection>
                    </ScrollView>
                    <span className={FileSharingModalCSS.description}>Click on 'x' to remove user permission.</span>
                </div>
            </div>
        </Modal>
    );
}
export default FileSharingModal;