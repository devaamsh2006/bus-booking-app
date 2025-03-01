import { createContext, useEffect, useState } from "react";
export const userDetails=createContext();
function UserAuthentication({children}){
    const [currentUser,setCurrentUser]=useState({
        imageUrl:'',
        fullName:'',
        phoneno:'',
        email:'',
        userType:'',
        userId:'',
        location:''
    });
    useEffect(()=>{
        const userInStorage=localStorage.getItem('currentUser');
        console.log(JSON.parse(userInStorage));
        if(userInStorage){
            setCurrentUser(JSON.parse(userInStorage));
        }
    },[]);
    return(
    <userDetails.Provider value={{currentUser,setCurrentUser}}>
        {children}
    </userDetails.Provider>
    )
}

export default UserAuthentication;