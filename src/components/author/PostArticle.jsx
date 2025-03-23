import './PostArticle.css'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useContext,useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts'
import {useNavigate} from 'react-router-dom'

export default function PostArticle(){

    const navigate=useNavigate()
    const {register,handleSubmit,formState:{errors}}=useForm()
    const {currentUser}=useContext(userAuthorContextObj )
    const [error,setError]=useState('')

    async function postArticle(articleObj){
        //create article object as per the article schema
        const authorData={
            nameOfAuthor:currentUser.firstName,
            email:currentUser.email,
            profileImageUrl:currentUser.profileImageUrl
        }
        //now add a propert to the articleObj
        articleObj.authorData=authorData
        //article id(timestamp)
        articleObj.articleId=Date.now()
        //dateOfCreation
        let currentDate=new Date();//gives current date
        articleObj.dateOfCreation=currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear()+' '+currentDate.toLocaleTimeString("en-US",{hour12:true})
        //dateOfModification 
        articleObj.dateOfModification=currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear()+' '+currentDate.toLocaleTimeString("en-US",{hour12:true})

        //comment {since author does not add comments we have empty array}
        articleObj.comments-[]
        //active state
        articleObj.isArticleActive=true
        console.log(articleObj)

        let res=await axios.post('http://localhost:3000/author-api/article',articleObj)
        let {message,payload}=res.data
        if(res.status===201){//means the article is posted successfully
            navigate(`/author-profile/${currentUser.email}/articles`)//navigate tackes the path of URl which is mentioned in routing config in main.jsx
        }else{
            setError(message);
        }
    }

    return(
    <div className=''>
        <div className="card w-50 mx-auto mt-5 pb-3" style={{backgroundColor:' #F6DED8'}}>
            <h1 className="text-center mt-3">Write an Article</h1>
            <form className="mb-3 mt-3" onSubmit={handleSubmit(postArticle)}>
                {/* Title */}
                <div className="w-75 mx-auto pt-3">
                    <label htmlFor="title" 
                     className="form-label fs-5">Title</label>
                     <input type="text" {...register('title',{required:true})} id="title" className="form-control"/>
                     {
                        errors.title?.type==='required' && <p className='text-danger'>*Title is required</p>
                     }
                </div>
                <div className="w-75 mx-auto pt-3">
                    <label htmlFor="category" 
                     className="form-label fs-5">Select a Category</label>
                    <select id="category" {...register('category',{required:true})} className="form-select">
                        <option value="" >--categories--</option>
                        <option value="experiences">Experiences</option>
                        <option value="education">Education</option>
                        <option value="technology">Technology</option>
                        <option value="health&wellness">Health&Wellness</option>
                        <option value="entertainment">Entertainment</option>
                    </select>
                    {
                        errors.category?.type==='required' && <p className='text-danger'>*Category is Required</p>
                    }
                </div>
                <div className="w-75 mx-auto pt-3">
                    <label htmlFor="content" className="form-label fs-5">Content</label>
                    <textarea 
                        id="content"
                        {...register('content',{required:true,minLength:30})}
                        className="form-control"
                        placeholder="--Start writing your Article here--"
                        rows="5"
                    />
                    {
                        errors.content?.type==='required' && <p className='text-danger'>*Content is Required</p>
                    }
                    {
                        errors.content?.type==='minLength' && <p className='text-danger'>*Minimum of 30 characters required</p>
                    }
                    <div className="d-flex justify-content-end mt-3">
                        <button type='submit' className="btn" style={{backgroundColor:'#64B6AC',color:'white'}}>Post</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}
