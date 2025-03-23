import './ArticleById.css'
import { useContext, useState, useEffect } from 'react'
import {useLocation,useNavigate} from 'react-router-dom'//this is useful to get state sent by navigate from 
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts'//get the role which is not present in article schema
import {useAuth} from '@clerk/clerk-react';
//for delete
import { MdDelete } from "react-icons/md";
//for edit
import { FaEdit } from "react-icons/fa";
import { MdOutlineRestore } from "react-icons/md";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { SlCalender } from "react-icons/sl";
import { CiTimer } from "react-icons/ci";

export default function ArticleById(){

    const{register,handleSubmit,formState:{errors},reset}=useForm()
    const navigate=useNavigate()
    const {state}=useLocation()

    const [currentArticle, setCurrentArticle] = useState(state || {}); 
    const [noOfComments, setNoOfComments] = useState(state?.comments?.length || 0);
    const [commentStatus,setCommentStatus]=useState(false)
    //for loading
    const [loading,setLoading]=useState(false)

    // console.log(state)
    const {currentUser} =useContext(userAuthorContextObj)

    const {getToken}=useAuth()
    //for editing the artice
    const[editArticleStatus,setEditArticleStatus]=useState(false)
    function enableEdit(){
        setEditArticleStatus(true)
    }
    //to save the modified article
    async function onSave(modifiedArticle){
        //we need to make http req 
        //but before that we need to see that we have all properties as schema 
        const articleAfterChange={...state,...modifiedArticle}
        const currentDate=new Date()
        const token=await getToken() 

        //add date of modifictaion
        articleAfterChange.dateOfModification=currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear()+' '+currentDate.toLocaleTimeString('en-US',{hour12:true})
        //make http
        //NOTE: if you dont write await you will not get res
        let res=await axios.put(`http://localhost:3000/author-api/article/${articleAfterChange.articleId}`,articleAfterChange,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(res.data.message==='Article modified'){
            setEditArticleStatus(false)
            navigate(`/author-profile/:email/${articleAfterChange.articleId}`,{state:res.data.payload})
        }
    }

    //delete
    async function deleteArticle(){
        state.isArticleActive=false
        let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
        if(res.data.message=='Article deleted or restored'){
            setCurrentArticle(res.data.payload)
        }
    }

    //restore
    async function restoreArticle(){
        state.isArticleActive=true
        let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
        if(res.data.message=='Article deleted or restored'){
            setCurrentArticle(res.data.payload)
        }
    }

    //adding comment
    async function addComment(commentObj) {
        setLoading(true)
        commentObj.nameOfUser=currentUser.firstName+' '+currentUser.lastName;
        commentObj.userImageUrl=currentUser.profileImageUrl
        let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj)
        if(res.data.message==="Comment added"){
            setCurrentArticle(res.data.payload)
            setNoOfComments(noOfComments=>(noOfComments+1))
            setCommentStatus(true)
            reset({comment:""})
        }
        setLoading(false)
    }
        //use the reset method from react-form-hook we should name the property as the name we registered 
        //NOTE : If you use " " instead of "" after clicking on Cancel the input field will not show the placeholder
       
    async function clearComment(){
         reset({comment:"",
            reason:""
         })
    }

    return(
        <div className='container mt-5 '>
            {
                editArticleStatus===false ?
                <>
                <div className='d-flex justify-content-between ' >
             <div className=" author-card card w-100 p-4 me-3">
                <div className="rounded-2 d-flex justify-content-between align-items center">
                    <div>
                        <p className='display-3'>{state?.title}</p>
                        <span className="">
                            <small className='me-4'>
                            <SlCalender style={{color: 'rgb(88,19,18)'}}/>
                            Created on : {state?.dateOfCreation}
                            </small>
                            <small className='me-4'>
                            <CiTimer style={{color: 'rgb(88,19,18)'}}/>
                            Modified on : {state?.dateOfModification}
                            </small>
                        </span>
                    </div>
                    <div >
                        <img src={state?.authorData.profileImageUrl} width='40px' className='rounded-circle' />
                        <p>{state?.authorData.nameOfAuthor}</p>
                    </div>
                </div>
             </div>
                {/* edit of delete */}
                {
                currentUser?.role==="author" && (
                    <div className='d-flex h-50'>
                        {/* since no arguments are passed into func when clicked hence not using ()=>func */}
                        <button className='btn me-2 ms-2 fs-4 d-flex align-items-center' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={enableEdit}><FaEdit /></button>
                        {/* if article active-delete else restore */}
                        {
                            state?.isArticleActive===true ?(
                                <button className='btn fs-4 d-flex align-items-center' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={deleteArticle}><MdDelete /></button>
                            ):(
                                <button className='btn fs-4 d-flex align-items-center' style={{backgroundColor:'#64B6AC',color:'white'}} onClick={restoreArticle}><MdOutlineRestore /></button>
                            )
                        }
                        
                    </div>
                )
             }
             </div>
             
             {/* content */}
             <p className="content-card  lead mt-3 card p-4" style={{whiteSpace:"pre-line",backgroundColor:' #F6DED8'}}>{state?.content}</p>
             {/* user comments */}
             <div className='mt-5'>
                {
                    currentArticle?.comments?.length===0 ? <p>No Comments Yet</p>:(
                        <>
                        { noOfComments==1?<p>{noOfComments} Comment</p>:<p>{noOfComments} Comments</p>}
                        <hr/>
                        {

                            currentArticle?.comments?.map((commentObj)=>(
                                <div className='d-flex mt-3' key={commentObj._id} >
                                    <img src={commentObj?.userImageUrl} className='rounded-circle me-2' width="30px" height='30px' />
                                    <div >
                                        <p>{commentObj?.nameOfUser}</p>
                                        <p>{commentObj?.comment}</p>
                                    </div>
                                </div>
                           ))}
                        </>
                    )
                }
             </div>
             
             {
                currentUser.role === "user" && (
                <form className="w-100 mt-2 " onSubmit={handleSubmit(addComment)}>
                    {loading?(
                        <div className="d-flex justify-content-center my-3">
                            <span className="spinner-border spinner-border-md" style={{color:'#64B6AC'}}></span>
                        </div>                    ):(
                        <div className="d-flex w-100 align-items-start">
                        <img src={currentUser.profileImageUrl} className="rounded-circle me-2" width="40px" />
                        <div className="flex-grow-1">
                            <input type="text" {...register('comment')} className="form-control w-100" placeholder="--write your comment here--" autoComplete='off' />
                            <div className="d-flex justify-content-end mt-2">
                                {/* e.preventDefault() is to prevent submission of the form after clicking on the Cancel button since it is in form */}
                                <button className="btn text-end mb-5" onClick={(e)=>{e.preventDefault(),clearComment()}}>Cancel</button>
                                <button type='submit' className="btn text-end mb-5" style={{ backgroundColor: "#64B6AC", color: "white" }}>
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                    
                </form>
             )}

                </>:
                <div className="card w-50 mx-auto mt-5 pb-3" style={{backgroundColor:'#F6DED8'}}>
                <h1 className="text-center mt-3">Edit Article</h1>
                <form className="mb-3 mt-3" onSubmit={handleSubmit(onSave)} >
                    {/* Title */}
                    <div className="w-75 mx-auto pt-3">
                        <label htmlFor="title" 
                         className="form-label fs-5">Title</label>
                         <input type="text" {...register('title',{required:true})} id="title" className="form-control"
                         defaultValue={state.title}/>
                         {
                            errors.title?.type==='required' && <p className='text-danger'>*Title is required</p>
                         }
                    </div>
                    <div className="w-75 mx-auto pt-3">
                        <label htmlFor="category" 
                         className="form-label fs-5">Select a Category</label>
                        <select id="category" {...register('category',{required:true})} className="form-select"
                        defaultValue={state.category}>
                            <option value="" >--categories--</option>
                            <option value="life">Life Experiences</option>
                            <option value="education">Education & Learning</option>
                            <option value="technology">Technology & Innovation</option>
                            <option value="health">Health & Wellness</option>
                            <option value="entertainment">Entertainment & Media</option>
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
                            defaultValue={state.content}
                        />
                        {
                            errors.content?.type==='required' && <p className='text-danger'>*Content is Required</p>
                        }
                        {
                            errors.content?.type==='minLength' && <p className='text-danger'>*Minimum of 30 characters required</p>
                        }
                        <div className="d-flex justify-content-end mt-3">
                            <button type='submit' className="btn" style={{backgroundColor:'#64B6AC',color:'white'}}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
            }
            
        </div>
    )
}