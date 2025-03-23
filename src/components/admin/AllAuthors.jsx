import { useContext, useState, useEffect } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { useLocation } from 'react-router-dom';

export default function AllAuthors() {
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState(null);
    const { currentUser,loading, setLoading } = useContext(userAuthorContextObj);
    const { state } = useLocation();

    useEffect(() => {
        async function getsAuthors(){
            try {
                const res = await axios.get('http://localhost:3000/author-api');
                if (res.data.message === 'All authors') {
                    setAuthors(res.data.payload);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch authors');
                setLoading(false);
            }
        }
        getsAuthors();
    }, []);
    
    return (
        <div className='container'>
            <h2 className='text-center mt-5 mb-4'>List of Article Writers</h2>
            
            {loading && <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <span className="spinner-border spinner-border-md" style={{ color: '#64B6AC' }}></span>
            </div>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && authors.length === 0 && <p>No authors are currently active.</p>}

            {!loading && authors.length > 0 && (
                <table className='table-bordered' style={{ width: "100%", textAlign: "center"}}>
                    <thead style={{backgroundColor:' #F6DED8'}}>
                        <tr className='fs-5'>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody style={{backgroundColor:' white'}}>
                        {authors.map((user) => (
                            <tr key={user._id} className='fs-5'>
                                <td className='py-2'>{user._id}</td>
                                <td className='py-2'>{user.firstName} {user.lastName}</td>
                                <td className='py-2'>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}



// import { useContext, useState, useEffect } from 'react';
// import { userAuthorContextObj } from '../../contexts/UserAuthorContexts';
// import axios from 'axios';
// import { MdDelete } from "react-icons/md";
// import { useLocation } from 'react-router-dom';

// export default function AllAuthors() {
//     const [authors, setAuthors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { currentUser,users} = useContext(userAuthorContextObj);
//     const { state } = useLocation();
//     console.log(users)

//     useEffect(() => {
//         async function getsAuthors(){
//             try {
//                 const res = await axios.get('http://localhost:3000/author-api');
//                 console.log("API Response:", res.data.payload); 
//                 if (res.data.message === 'All authors') {
//                     setAuthors(res.data.payload);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError('Failed to fetch authors');
//                 setLoading(false);
//             }
//             setTimeout(() => {
//                 console.log(authors);
//             }, 1000);
//         }
//         getsAuthors();
//     }, []);

//     async function deleteAuthor(email) { 
//         try {
//             console.log("Deleting author with email:", email); 
//             const res = await axios.put(`http://localhost:3000/author-api/block/${email}`, { isActive: false });
//             if (res.data.message === "Author Deleted") {
//                 setAuthors(prevAuthors => prevAuthors.filter(user => user.email !== email)); 
//             }
//         } catch (err) {
//             console.error("Failed to delete author: ", err.response ? err.response.data : err);
//         }
//     }
    
    
//     return (
//         <div className='container'>
//             <h2>All Authors</h2>
            
//             {loading && <p>Loading...</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
            
//             {!loading && authors.length === 0 && <p>No authors are currently active.</p>}

//             {!loading && authors.length > 0 && (
//                 <table className='table-bordered' style={{ width: "100%", textAlign: "center" }}>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Delete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {authors.map((user) => (
//                             <tr key={user._id}>
//                                 <td>{user._id}</td>
//                                 <td>{user.firstName} {user.lastName}</td>
//                                 <td>{user.email}</td>
//                                 <td>
//                                     <button 
//                                         className='btn fs-4 d-flex align-items-center' 
//                                         style={{ backgroundColor: '#64B6AC', color: 'white' }} 
//                                         onClick={() => deleteAuthor(user.email)}>
//                                         <MdDelete />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

