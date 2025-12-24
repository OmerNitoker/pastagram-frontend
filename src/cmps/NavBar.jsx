import { useState, useEffect } from 'react'
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom'
import { AddPost } from './AddPost'
import { SearchIcon } from './icons-cmps/SearchIcon'
import { ExploreIcon } from './icons-cmps/ExploreIcon'
import { ReelsIcon } from './icons-cmps/ReelsIcon'
import { MessagesIcon } from './icons-cmps/MessagesIcon'
import { NotificationsIcon } from './icons-cmps/NotificationsIcon'
import { CreateIcon } from './icons-cmps/CreateIcon'
import { MoreIcon } from './icons-cmps/MoreIcon'
import { HomeIcon } from './icons-cmps/HomeIcon'
import { InstagramLogo } from './icons-cmps/InstagramLogo'
import { userService } from '../services/user.service'
import { PastagramLogo } from './icons-cmps/PatagramLogo'
import { MoreMenu } from './MoreMenu'
import logoImg from '../assets/img/logo-png.png'



export function NavBar() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const [isLoginPath, setIsLoginPath] = useState(false)
    const loggedinUser = userService.getLoggedinUser();
    const location = useLocation();

    useEffect(() => {
        if (!loggedinUser) navigate('/login')
    },[])

    useEffect(() => {
       if (location.pathname.includes('/login')) setIsLoginPath(true)
       else setIsLoginPath(false)
    }, [location.pathname]);

    function isLinkActive(path) {
        return location.pathname === path
    }

    function onAddPost() {
        setIsModalOpen(true);
    }

    function onCloseModal() {
        setIsModalOpen(false);
    }

    function toggleMoreMenu() {
        setIsMoreOpen(!isMoreOpen)
    }

    function onLogoutClicked() {
        userService.logout()
        navigate('/login')
    }
   
    return (

        <section className= {isLoginPath ? 'nav-bar hidden' : 'nav-bar'}>
            <div className="narrow-top-bar"></div>
            <div className="insta-icon"> 
                <InstagramLogo margin="1.5em" marginTop="40px" />
            </div>
            <div className="pasta-logo nav-logo">
                <img src= {logoImg} alt=""/>
            </div>


            <ul className="nav-list">
                <li className="nav-item home">
                    <Link to="/" className="nav-link" style={{ fontWeight: isLinkActive('/') ? 600 : 'normal' }}>
                        <HomeIcon marginRight="1em" active={isLinkActive('/')} />
                        <span className='nav-name'>Home</span>
                    </Link>
                </li>
                <li className="nav-item search">
                    <Link to="/search" className="nav-link" style={{ fontWeight: isLinkActive('/search') ? 600 : 'normal' }}>
                        <SearchIcon marginRight="1em" active={isLinkActive('/search')} />
                        <span className='nav-name'>Search</span>

                    </Link>
                </li>
                <li className="nav-item explore">
                    <Link /*to="/explore"*/ className="nav-link" style={{ fontWeight: isLinkActive('/explore') ? 600 : 'normal' }}>
                        <ExploreIcon marginRight="1em" active={isLinkActive('/explore')} />
                        <span className='nav-name'>Explore - soon</span>

                    </Link>
                </li>
                <li className="nav-item reels">
                    <Link /*to="/reels"*/ className="nav-link" style={{ fontWeight: isLinkActive('/reels') ? 600 : 'normal' }}>
                        <ReelsIcon marginRight="1em" active={isLinkActive('/reels')} />
                        <span className='nav-name'>Reels - soon</span>

                    </Link>
                </li>
                <li className="nav-item chat">
                    <Link /*to="/chat"*/ className="nav-link" style={{ fontWeight: isLinkActive('/chat') ? 600 : 'normal' }}>
                        <MessagesIcon marginRight="1em" active={isLinkActive('/chat')} />
                        <span className='nav-name'>Messages - soon</span>

                    </Link>
                </li>
                <li className="nav-item notifications">
                    <Link /*to="/notifications"*/ className="nav-link" style={{ fontWeight: isLinkActive('/notifications') ? 600 : 'normal' }}>
                        <NotificationsIcon marginRight="1em" active={isLinkActive('/notifications')} />
                        <span className='nav-name'>Notifications - soon</span>
                    </Link>
                </li>
                <li onClick={onAddPost} className="nav-item create">
                    <Link className="nav-link">
                        <CreateIcon marginRight="1em" />
                        <span className='nav-name'>Create</span>

                    </Link>
                </li>
                <li className="nav-item userDetails">
                    <Link to={loggedinUser ? `/user/${loggedinUser._id}` : '/user'} className="nav-link" style={{ fontWeight: isLinkActive('/user') ? 600 : 'normal' }}>
                       {loggedinUser ? <img src={loggedinUser.imgUrl} className="user-avatar nav-img" /> : 
                        <img src= 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png' className="user-avatar nav-img" />}
                        <span className='nav-name'>Profile</span>
                    </Link>
                </li>
                <li className="nav-item hamburger-menu" onClick={toggleMoreMenu}>
                    <Link className="nav-link">
                        <MoreIcon marginRight="1em" />
                        <span className='nav-name'>More</span>
                    </Link>
                </li>
            </ul>
            {isModalOpen && <AddPost setIsModalOpen={setIsModalOpen} onCloseModal={onCloseModal} />}
            {isMoreOpen && <MoreMenu toggleMoreMenu={toggleMoreMenu} onLogoutClicked={onLogoutClicked} />}
        </section>
    )
}