import axios from "axios"
import './Articles.css'
import { useState,useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { userAuthorContextObj } from "../../contexts/UserAuthorContexts"

import {useAuth} from "@clerk/clerk-react"//to get the token
export default function Articles(){
    
    const navigate=useNavigate()
    const[articles,setArticles]=useState([])
    const[error,setError]=useState('')
    const [filter,setFilter]=useState('All')
    const {currentUser}=useContext(userAuthorContextObj)
    //getToken
    const{getToken}=useAuth()

    //for loading
    const [loading,setLoading]=useState(false)

    console.log(currentUser)
    //get all articles
    async function getArticles(){
    //Uses of function--for imediate response,make api req
        setLoading(true)
        //get jwt token
        const token=await getToken()
        //make authenticated request
        let res=await axios.get('http://localhost:3000/author-api/articles',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(res.data.message==='articles'){
            setLoading(false)
            setArticles(res.data.payload)
            setError('')
        }
        else{
            setError(res.data.message)
        }
    }
    useEffect(()=>{
        //uses of useEffect //redirected automatically 
        getArticles()
    },[])

    function getArticleById(articleObj){
        navigate(`../${articleObj.articleId}/`,{state:articleObj})//react router dom also provides facitity to send state
        //here we are sending the article object because the component should know what article it should display
    }

    async function getFiltered(category){
        setLoading(true)
        if (category === "All") {
            getArticles(); // Fetch all articles again
            // setLoading(false)
            setFilter("All");
            return;
        }
        
        try {
            let categoryLower = category.toLowerCase(); // Convert to lowercase
            let res = await axios.get(`http://localhost:3000/author-api/articles/${categoryLower}`);
        
            if (res.data.message === "Article filtered") {
                setFilter(category);
                setArticles(res.data.payload);
                setError("");
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Error fetching articles");
        }
        setLoading(false)
    }
    return (
        <div className="container">
                <>
                {/* Dropdown for category filter */}
                <div className="dropdown mb-4 d-flex justify-content-end mt-3" >
                    <button className="btn border-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" style={{backgroundColor:'#64B6AC',color:'white'}}>
                        {filter === 'All' ? 'Filter Articles' : `Category: ${filter}`}
                    </button>
                    <ul className="dropdown-menu" style={{backgroundColor:' #F6DED8'}}>
                        <li className="dropdown-item" onClick={() => getFiltered('All')}>
                            All
                        </li>
                        {['Experiences', 'Education', 'Technology', 'Health&Wellness', 'Entertainment'].map((category) => (
                            <li key={category} className="dropdown-item" onClick={() => getFiltered(category)}>
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>
                <hr></hr>
                {/* Display error message if any */}
                {error.length !== 0 && <p className="text-danger">*{error}</p>}

                {/* Loading spinner */} 
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <span className="spinner-border spinner-border-md" style={{ color: '#64B6AC' }}></span>
                    </div>
                ) : (
                    <>
                        {/* Cards displaying articles */}
                        {articles.length===0?(
                            <div>
                                <h1 className="fs-4 text-center" style={{fontFamily:'Gluten',fontWeight:'300'}}>No articles in the category you selected</h1>
                            </div>
                        ):(
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 mt-3">
                                {articles.map((articleObj) => (
                                    <div className="col mt-3" key={articleObj.articleId}>
                                        <div className="article-card card h-100">
                                            <div className="card-header text-end">
                                                    <small className=" me-1">{articleObj.authorData.nameOfAuthor}</small>
                                                    <img
                                                        src={articleObj.authorData.profileImageUrl}
                                                        width="40px"
                                                        className="rounded-circle"
                                                        alt="Author"
                                                    />
                                            </div>
                                            <div className="card-body">
                                                
                                                <h5 className="card-title">{articleObj.title}</h5>
                                                <p className="card-text">{articleObj.content.substring(0, 80) + '....'}</p>
                                                <button
                                                    className="btn"
                                                    style={{ backgroundColor: '#64B6AC', color: 'white' }}
                                                    onClick={() => getArticleById(articleObj)}>
                                                         Read more
                                                </button>
                                            </div>
                                            <div className="card-footer">
                                                <small>Last Updated on {articleObj.dateOfModification}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
                </> 
        </div>
    )
}


