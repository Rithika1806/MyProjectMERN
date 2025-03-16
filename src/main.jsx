import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {createBrowserRouter,RouterProvider,Navigate} from 'react-router-dom'
import RootLayout from './components/RootLayout.jsx'
import Home from './components/common/Home.jsx'
import Signin from './components/common/Signin.jsx'
import Signup from './components/common/Signup.jsx'
import UserProfile from './components/user/UserProfile.jsx'
import Articles from './components/common/Articles.jsx'
import AuthorProfile from './components/author/AuthorProfile.jsx'
import PostArticle from './components/author/PostArticle.jsx'
import ArticleById from './components/common/ArticleById.jsx'
import UserAuthorContexts from './contexts/UserAuthorContexts.jsx'
import AdminProfile from './components/admin/AdminProfile.jsx'
import AllAuthors from './components/admin/AllAuthors.jsx'
import AllUsers from './components/admin/AllUsers.jsx'

const browserRouterObj=createBrowserRouter([
  {
    path:'/',
    element:<RootLayout/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"signin",
        element:<Signin/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"user-profile/:email",
        element:<UserProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticleById/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      },
      {
        path:"author-profile/:email",
        element:<AuthorProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>,
          },
          {
            path:":articleId",
            element:<ArticleById/>
          },
          {
            path:'article',
            element:<PostArticle/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      },
      {
        path:"admin-profile/:email",
        element:<AdminProfile/>,
        children:[
          {
            path:"users",
            element:<AllUsers/>,
          },
          {
            path:"authors",
            element:<AllAuthors/>,
          },
          {
            path:"",
            element:<Navigate to="authors"/>
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContexts>
      <RouterProvider router={browserRouterObj}/>
    </UserAuthorContexts>
  </StrictMode>,
)
