import { useContext, useState, useEffect } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { useLocation } from 'react-router-dom';

export default function AllAuthors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(userAuthorContextObj);
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

    async function deleteAuthor(email) { 
        try {
            console.log("Deleting author with email:", email); // Debugging line
            
            const res = await axios.put(`http://localhost:3000/author-api/${email}`, state); // Empty body required for PUT
            
            if (res.data.message === "Author Deleted") {
                setAuthors(authors.filter(user => user.email !== email)); // Update UI after deletion
            }
        } catch (err) {
            console.error("Failed to delete author: ", err.response ? err.response.data : err);
        }
    }
    
    return (
        <div className='container'>
            <h2>All Authors</h2>
            
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && authors.length === 0 && <p>No authors are currently active.</p>}

            {!loading && authors.length > 0 && (
                <table className='table-bordered' style={{ width: "100%", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button 
                                        className='btn fs-4 d-flex align-items-center' 
                                        style={{ backgroundColor: '#64B6AC', color: 'white' }} 
                                        onClick={() => deleteAuthor(user.email)}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

