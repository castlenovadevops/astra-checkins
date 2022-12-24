
export const logout = () => {
    localStorage.clear();
}

export const isDeviceRegistered = ()=>{ 
    if (localStorage.getItem('merchantdetail')) {
        return true;
    }

    return false;
}

export const isLogin = () => {
    if (localStorage.getItem('userdetail')) {
        // console.log("IFFFFFFFFF")
        return true;
    }

    return false;
}
