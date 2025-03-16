import Header from './common/Header'
import Footer from './common/Footer'
import { Outlet } from 'react-router-dom' 
import {ClerkProvider} from '@clerk/clerk-react'
import UserAuthorContextProvider from '../contexts/UserAuthorContexts'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
export default function RootLayout(){
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}> 
            <UserAuthorContextProvider>
            <Header/>
                <div style={{minHeight: '100vh'}}>
                    <Outlet/>
                </div>
            <Footer/>
            </UserAuthorContextProvider>
        </ClerkProvider>
    )
}