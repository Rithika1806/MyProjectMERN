import { SignIn } from "@clerk/clerk-react";

export default function Signin(){
    return(
        <div className="d-flex justify-content-center" style={{marginTop:'100px'}}>
            <SignIn/>
        </div>
    )
}