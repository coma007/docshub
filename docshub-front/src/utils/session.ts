export const getCurrentSession = () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user
}

export const getCurrentSessionAttribbutes = () => {
    let user = getCurrentSession();
    return user['attributes']
}

export const getCurrentSessionSub = () => {
    let attributes = getCurrentSessionAttribbutes();
    return attributes['sub']
}