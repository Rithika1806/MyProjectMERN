import { NavLink, Outlet } from "react-router-dom";
import './AuthorProfile.css'

import { userAuthorContextObj } from "../../contexts/UserAuthorContexts";
import { useContext } from "react";
export default function AuthorProfile(){
    const {currentUser}=useContext(userAuthorContextObj)
    return(
        <div>
            <div className="author-activity-card card w-50 mx-auto" style={{backgroundColor:'#A6808C',marginTop:'30px'}}>
                <ul className="nav nav-pills w-100 justify-content-around  ">
                    <li className="nav-item">
                                    <NavLink to='articles' className='nav-link'>Articles</NavLink>
                    </li>
                    <li className="nav-item">
                                    <NavLink to='article' className='nav-link'>Add new Article</NavLink>
                    </li>
                </ul>
            </div>
            <div>
                <Outlet/>
            </div>  
        </div>
    )
}
