import './Home.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext,useEffect,useState} from "react"
import { userAuthorContextObj } from "../../contexts/UserAuthorContexts.jsx"
import {useUser} from '@clerk/clerk-react'
//Axios is a promise-based HTTP client for making requests to APIs. In your MERN stack blog app, Axios will play a key role in handling communication between the frontend (React) and the backend (Node.js/Express with MongoDB).
//we use this in place of fetch
import axios from 'axios'
import { TiArrowRightOutline } from "react-icons/ti";


export default function Home(){
    const navigate=useNavigate()
    const {state}=useLocation()
    const {currentUser,setCurrentUser,setNotification,loading,setLoading}=useContext(userAuthorContextObj)
    //this user property contains user details hence we need to use useEffect hook for this
    const {isSignedIn,user,isLoaded}=useUser()
    console.log('state ',state)

    //to display error
    const [error,setError]=useState('')//we took error as string hence for checking we can check length
    //loading

    useEffect(() => {
      const storedUser = localStorage.getItem("currentuser");
      if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
      }
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer); // Cleanup to prevent memory leaks
    }, [currentUser]);
    

    ///NOTE: Just by duing this you will not get the output because both client  & server are running on different port number
    //Server can receive request from same origin(for security reasons backend will not accept from other domain) it blocked automatically by CORS(cross origin resource sharing)

  // initially loaded and whenever the state is changed then it is loaded
  useEffect(()=>{
    if (isLoaded && user) {
      setLoading(true)
      setCurrentUser((prev)=>({
          ...prev,
          firstName:user?.firstName,
          lastName:user?.lastName,
          email:user?.emailAddresses[0].emailAddress,
          profileImageUrl:user?.imageUrl,
      }))
    }
   },[isLoaded,user])//in this case isLoaded state is being changed, initially it is false but when changed to true means user 
  
  //after selection of role
  useEffect(() => {
    if (currentUser && currentUser.role && !loading) {
      if (currentUser?.role === "user" && error.length === 0) {
        navigate(`/user-profile/${currentUser.email}`);
      }
      if (currentUser?.role === "author" && error.length === 0) {
        console.log("first")
        navigate(`/author-profile/${currentUser.email}`);
      }
      if (currentUser?.role === "admin" && error.length === 0) {
        console.log("first")
        navigate(`/admin-profile/${currentUser.email}`);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
          localStorage.setItem("currentuser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

    async function onSelectRole(e) {
        //clear error property
        setError('')
        const selectedRole = e.target.value;
        const updatedUser = { ...currentUser, role: selectedRole, isActive: currentUser.isActive};
        try {
          let res = null;
          if (selectedRole === 'author') {
            res = await axios.post('http://localhost:3000/author-api/author', updatedUser)
            let { message, payload } = res.data;
            if (message === 'author') {
              setCurrentUser({ ...updatedUser, ...payload, isActive: currentUser.isActive })
              localStorage.setItem("currentuser", JSON.stringify({ ...updatedUser, ...payload }));
              //when we refresh the page the entire react application will be reinitialised & lost connection with backened
              //now the react comp doesnot know whether he is user or author
              // setError(null)
            } else {
              setError(message);
            }
          }
          if (selectedRole === 'user') {
            console.log(currentUser)
            res = await axios.post('http://localhost:3000/user-api/user', updatedUser)
            let { message, payload } = res.data;
            console.log(message)
            if (message === 'user') {
              setCurrentUser({ ...updatedUser, ...payload })
              localStorage.setItem("currentuser", JSON.stringify({ ...updatedUser, ...payload }));
            } else {
              setError(message);
            }
          }
          if (selectedRole === 'admin') {
            console.log(currentUser)
            res = await axios.post('http://localhost:3000/admin-api/admin', updatedUser)
            let { message, payload } = res.data;
            console.log(message)
            if (message === 'admin') {
              setCurrentUser({ ...updatedUser, ...payload })
              localStorage.setItem("currentuser", JSON.stringify({ ...updatedUser, ...payload }));
            } else {
              setError(message);
            }
          }
        } catch (err) {
          setError(err.message);
        }
      }
  console.log('currentuser',currentUser)
    return(
      <>
      {
        loading?(
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <span className="spinner-border spinner-border-md" style={{ color: '#64B6AC' }}></span>
          </div>
        ):(
        <div className='container-home'>
            {
              isSignedIn===false && <div className='text-center container' style={{marginTop:'100px'}}>
                <div className='d-flex'>
                  <img className='home-img ' src='/public/tech.jpg' />
                  <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingLeft:'100px'}}>
                    <p className="home-text w-100">Learning is fun—so why keep it to yourself? Share your knowledge and inspire others!</p>
                    <button className='home-btn btn mx-auto d-flex align-items-center mt-4 ' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Get started<TiArrowRightOutline/></button>
                  </div>
                </div>
                <div className='d-flex'>
                  <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingRight:'100px'}}>
                    <p className="home-text w-100">Got something in your mind? Scribble your thoughts, share your stories, and let the world hear you!</p>
                    <button className='home-btn btn mx-auto d-flex align-items-center  mt-4 ' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Get started <TiArrowRightOutline /></button>
                  </div>                    
                  <img className='home-img' src='/public/write.jpg'height='500px' />
                </div>
                <div className='d-flex'>
                  <img className='home-img' src='/public/skincare.jpg'height='500px' />
                  <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingLeft:'100px'}}>
                    <p className="home-text w-100">Glow inside and out—share your skincare secrets and let your beauty shine!</p>
                    <button className='home-btn btn mx-auto d-flex align-items-center mt-4' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Get started <TiArrowRightOutline /></button>
                  </div>
                </div>
                <div className='d-flex'>
                <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingRight:'100px'}}>
                    <p className="home-text w-100">Delicious meets nutritious—share your favorite healthy and fun food recipes!</p>
                    <button className='home-btn btn mx-auto d-flex align-items-center  mt-4 ' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Get started <TiArrowRightOutline /></button>
                  </div>
                  <img className='home-img' src='/public/food2.jpg'height='500px' />
                </div>
                <div className='d-flex'>
                  <img className='home-img' src='/public/travel.jpg'height='500px' />
                  <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingLeft:'100px'}}>
                    <p className="home-text w-100">Every travel journey has a story so what's yours ? </p>
                    <button className='home-btn btn mx-auto d-flex align-items-center  mt-4 ' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Get started <TiArrowRightOutline /></button>
                  </div>
                </div>
                <div className='d-flex'>
                <div className='d-flex flex-column justify-content-center align-items-center' style={{paddingRight:'100px'}}>
                    <p className="home-text w-100">Cozy Quill is your happy space—a warm corner to share, learn, and grow together!</p>
                    <div className='d-flex'>
                      <button className='home-btn btn mx-auto d-flex align-items-center mt-4 me-4' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signin'); window.scrollTo(0, 0);}}>Have an account <TiArrowRightOutline /></button>
                      <button className='home-btn btn mx-auto d-flex align-items-center mt-4' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={()=>{navigate('/signup'); window.scrollTo(0, 0);}}>Create an account <TiArrowRightOutline /></button>
                    </div>
                  </div>
                  <img className='home-img' src='/public/lastt.jpg'height='500px' />
                </div>
              </div>
}
                
                {
          isSignedIn === true && (
              <div>
                {/* {loading ? (
                  <div className="mt-5 d-flex justify-content-center align-items-center vw-100 vh-50">
                    <span className="mt-5 spinner-border spinner-border-md" style={{ color: '#64B6AC' }}></span>
                  </div>
                ) : ( */}
                  <>
                    <div className="card w-50 mx-auto afterSignInCard">
                        <div className="d-flex justify-content-center align-items-center">
                            <img src={user.imageUrl} width='120px' className="rounded-circle me-4" />
                            <p className="display-6">{user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <p className='fs-5' style={{ textAlign: 'center', paddingTop: '25px' }}>Choose your role:</p>
                    {error.length !== 0 && (
                        <p className='fs-5 text-center' style={{ fontFamily: 'sans-serif', color: "red" }}>*{error}</p>
                    )}
                    <div className='role-card card w-25 mx-auto' style={{ backgroundColor: '#A6808C' }}>
                        <div className="d-flex justify-content-around align-items-center">
                            <div className='form-check'>
                                <input 
                                    type='radio' 
                                    name='role'
                                    id='author'
                                    className='form-check-input' 
                                    value='author' 
                                    onChange={onSelectRole} 
                                />
                                <label htmlFor='author' className='form-check-label'>Author</label>
                            </div>
                            <div className='form-check'>
                                <input 
                                    type='radio' 
                                    name='role'
                                    id='user'
                                    className='form-check-input' 
                                    value='user' 
                                    onChange={onSelectRole} 
                                />
                                <label htmlFor='user' className='form-check-label'>User</label>
                            </div>
                            <div className='form-check'>
                                <input 
                                    type='radio' 
                                    name='role'
                                    id='admin'
                                    className='form-check-input' 
                                    value='admin' 
                                    onChange={onSelectRole} 
                                />
                                <label htmlFor='admin' className='form-check-label'>Admin</label>
                            </div>
                        </div>
                    </div>
                  </>
                {/* )} */}
              </div>
            
          )
        }
    </div>
    )
  }
      </>

    )
}




