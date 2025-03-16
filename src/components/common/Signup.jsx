import { SignUp } from "@clerk/clerk-react";

export default function Signup(){
    return(
        <div className="d-flex justify-content-center" style={{marginTop:'100px'}}>
            <SignUp/>
        </div>
    )
}