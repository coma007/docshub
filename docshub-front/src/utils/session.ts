import { Auth } from "aws-amplify";
import { resolve } from "path";

export const getCurrentSession = async () => {
    try {
        let user = await Auth.currentUserInfo();
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};


export const getCurrentSessionAttribbutes = async () => {
    let user = await getCurrentSession();
    return user['attributes']
}

export const getCurrentSessionSub = async () => {
    let attributes = await getCurrentSessionAttribbutes();
    return attributes['sub']
}


export const getCurrentSessionUsername = async () => {
    let session = await getCurrentSession();
    return session['username']
}

export const getToken = async () => {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken()
    return token
}