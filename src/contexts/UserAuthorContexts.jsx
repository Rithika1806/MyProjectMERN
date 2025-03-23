import { createContext,useState,useEffect} from "react";

//named export
export const userAuthorContextObj=createContext();

export default function UserAuthorContexts({children}){

    let [currentUser,setCurrentUser]=useState({
        firstName:'',
        lastName:'',
        email:'',
        profileImageUrl:'',
        role:'',
    })
    const [loading,setLoading]=useState(true)

    //when page reloaded it is not requesting backened
    //first checks if previous user present in local storage if available takes from local storage
    useEffect(()=>{
        const userInStorage=localStorage.getItem('currentuser')
        if(userInStorage){
            setCurrentUser(JSON.parse(userInStorage))
        }
    },[])

    return (
        <div>
            <userAuthorContextObj.Provider value={{currentUser,setCurrentUser,loading,setLoading}}>{children}</userAuthorContextObj.Provider>
        </div>
    )
}
