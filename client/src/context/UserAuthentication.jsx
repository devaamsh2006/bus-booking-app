import { createContext, useState } from "react";
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
    return(
    <userDetails.Provider value={{currentUser,setCurrentUser}}>
        {children}
    </userDetails.Provider>
    )
}

export default UserAuthentication;