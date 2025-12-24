import { useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { userService } from '../services/user.service';

export function Search({ toggleSidebar }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // const location = useLocation()

    const handleChange = async (event) => {
        setSearchTerm(event.target.value);
        const filterBy = {txt: event.target.value}
        const results = await userService.getUsers(filterBy)
        // const users = JSON.parse(localStorage.getItem('user')) || [];
        // const results = users.filter(user =>
        //     user.fullname.toLowerCase().includes(event.target.value.toLowerCase())
        // );
        setSearchResults(results);
    };



    return (
        <div className="search-page">
            {/* <h1>SEARCH</h1> */}
            <input
                type="search"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search"
                className="search-input" // Ajout de la classe "search-input"
            />
            {/* 
            <div className="delete-all-search">
                <h2>Recently</h2>
                <button>Delete all</button>
            </div> */}

            <ul className="search-list">
                {searchResults.map(user => (
                    <Link key={user._id} to={`/user/${user._id}`} className="search-item">
                        <img className="user-image" src={user.imgUrl} alt="" />
                        <div className="search-user-names">
                            <div className="search-user-username">
                                {user.username} </div>
                            <div className="search-user-fullname">
                                {user.fullname}
                            </div>

                        </div>
                        {console.log("user", user)}
                        <i class="fa-solid fa-x"></i>
                    </Link>
                ))}
                {/* {searchResults.map(user => (
                    <li key={user._id} className="search-item"> 
                        <img className="user-image" src={user.imgUrl} alt="" />
                        <div className="search-user-names">
                            <div className="search-user-username">
                                {user.username} </div>
                            <div className="search-user-fullname">
                                {user.fullname}
                            </div>

                        </div>
                        {console.log("user", user)}
                        <i class="fa-solid fa-x"></i>
                    </li>
                ))} */}
            </ul>
        </div>
    );

}
