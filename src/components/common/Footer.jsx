import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin,FaPinterest } from "react-icons/fa";

export default function Footer(){
    return (
        <div className="p-5 fs-4 d-flex justify-content-between align-items-center mt-5" style={{backgroundColor:'rgb(88,19,18)',color:'white'}}>
        {/* Social Media Icons (Left) */}
        <div>
            <FaPinterest className="me-2"/>
            <FaTwitter className="me-2"/>
            <FaInstagram className="me-2"/>
            <FaLinkedin className="me-2"/>
            <FaFacebook className="me-2"/>
        </div>
    
        {/* Terms & Privacy (Right) */}
        <div>
            <small className="me-5 fs-5">Terms of Use</small>
            <small className="fs-5">Privacy Policy</small>
        </div>
    </div>
    
    )
};

