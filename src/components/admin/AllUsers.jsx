import { useContext, useState, useEffect } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { useLocation } from 'react-router-dom';

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(userAuthorContextObj);
    const { state } = useLocation();

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await axios.get('http://localhost:3000/user-api');
                if (res.data.message === 'All users') {
                    setUsers(res.data.payload);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        }
        getUsers();
    }, []);

    async function deleteUser(email) { 
        try {
            console.log("Deleting user with email:", email); // Debugging line
            
            const res = await axios.put(`http://localhost:3000/user-api/${email}`, state); // Empty body required for PUT
            
            if (res.data.message === "User Deleted") {
                setUsers(users.filter(user => user.email !== email)); // Update UI after deletion
            }
        } catch (err) {
            console.error("Failed to delete user: ", err.response ? err.response.data : err);
        }
    }
    
    return (
        <div className='container'>
            <h2>All Users</h2>
            
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && users.length === 0 && <p>No users are currently active.</p>}

            {!loading && users.length > 0 && (
                <table className='table-bordered' style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button 
                                        className='btn fs-4 d-flex align-items-center' 
                                        style={{ backgroundColor: '#64B6AC', color: 'white' }} 
                                        onClick={() => deleteUser(user.email)}
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

