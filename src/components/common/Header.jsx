import "./Header.css"
import { useContext } from "react"
import { Link ,useNavigate } from "react-router-dom"
import { userAuthorContextObj } from "../../contexts/UserAuthorContexts"
import { useClerk,useUser } from '@clerk/clerk-react'
import { MdNotificationsActive } from "react-icons/md";

export default function Header(){

    //we donot have signout property in clerk we have useclerk which has property
    const {signOut}=useClerk()
    const {currentUser,setCurrentUser,notify,markNotificationsAsRead }=useContext(userAuthorContextObj)

    //react-router-dom provides useNavigate hook
    const navigate=useNavigate()
    //useUser hook has 3 properties
    const {isSignedIn,user,isLoaded}=useUser()

    //function to sign out
    //signOut is an asyncronous operation so modern way of handling is async & await
    async function handleSignOut(){
        await signOut()
        navigate('/')
    }

    // function handleClick() {
    //     if (unreadCount > 0) {
    //         markNotificationsAsRead();  // Mark all as read when clicked
    //     }
    //     setTimeout(() => {
    //         navigate(`/admin-profile/${currentUser.email}/notifications`);
    //     }, 300);  // Small delay to ensure state update
    // }

    return(
//NOTE :Yes!  Always apply align-items-center to the parent if you want to vertically align its child elements inside a flexbox container.
//Golden Rule:
//  Apply align-items: center; to a flex container (d-flex).
//  Do NOT apply align-items-center directly to child elements like <img> or <p>.
        <div>
            <nav className="header d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-between header-logo align-items-center" style={{width:'300px'}}>
                    <Link to='/'>
                        <img src="/public/blogapp1.png" className="img-fluid"></img>
                    </Link>
                    <h1>Cozy Quill</h1>
                </div>
                <ul className="d-flex justify-content-end header-link justify-content-between ">
                    {
                        !isSignedIn?
                        <>
                            <li>
                                <Link to='' className="nav-link threebtn p-2">Home</Link>
                            </li>
                            <li>
                                <Link to='signin' className="nav-link threebtn p-2">SignIn</Link>
                            </li>
                            <li>
                                <Link to='signup' className="nav-link threebtn p-2">SignUp</Link>
                            </li>
                        </>:
                        <div className="afterSignin d-flex align-items-center ">
                            <button className="btn btn-light signoutButton" onClick={handleSignOut}>Signout</button>
                            <div className="ms-3 me-2">
                                <img src={user.imageUrl} width='40px' className="rounded-circle profileLogo"/>
                            </div>
                            {
                                currentUser.role==='admin' && (
                                    <div className="position-relative d-inline-block">
                                        <button className="btn" style={{ color: "#F6DED8" }}>
                                            <MdNotificationsActive size={27} />
                                        </button>
                                    </div>
                            )}
                        </div>
                    }
                </ul>
            </nav>
        </div>
    )
}