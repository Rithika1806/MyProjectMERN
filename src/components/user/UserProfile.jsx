import { NavLink, Outlet } from "react-router-dom";

import { userAuthorContextObj } from "../../contexts/UserAuthorContexts";
import { useContext } from "react";
export default function AdminProfile(){
    const {currentUser}=useContext(userAuthorContextObj)
    return(
        <div>
            {
                currentUser.isActive===true ? (
                    <>
                        <div className="author-activity-card card w-50 mx-auto" style={{backgroundColor:'#A6808C',marginTop:'30px'}}>
                            <ul className="nav nav-pills w-100 justify-content-around  ">
                                <li className="nav-item">
                                    <NavLink to='authors' className='nav-link'>Articles</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <Outlet/>
                        </div>
            </>
                ):(
                    <p>You are currently blocked by admin. Please contact admin.</p>
                )
            }
            
        </div>
    )
}