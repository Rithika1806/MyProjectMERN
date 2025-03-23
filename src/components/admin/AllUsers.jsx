import { useContext, useState, useEffect } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContexts';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { useLocation } from 'react-router-dom';

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { currentUser ,loading, setLoading} = useContext(userAuthorContextObj);
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
    
    return (
        <div className='container'>
            <h2 className='text-center mt-5 mb-4'>List of Article Readers</h2>
            
            {loading && <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <span className="spinner-border spinner-border-md" style={{ color: '#64B6AC' }}></span>
            </div>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && users.length === 0 && <p>No users are currently active.</p>}

            {!loading && users.length > 0 && (
                <table className='table-bordered' style={{ width: "100%",textAlign: "center"}}>
                    <thead style={{backgroundColor:' #F6DED8'}}>
                        <tr className='fs-5'>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody style={{backgroundColor:' white'}}>
                        {users.map((user) => (
                            <tr key={user._id}  className='fs-5 '>
                                <td  className='py-2'>{user._id}</td>
                                <td  className='py-2'>{user.firstName} {user.lastName}</td>
                                <td  className='py-2'>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


