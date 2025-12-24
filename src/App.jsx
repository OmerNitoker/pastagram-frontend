import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HomePage } from './pages/HomePage';
import { NavBar } from './cmps/NavBar';
import { UserDetailsNew } from './pages/UserDetailsNew';
import { Chat } from './pages/Chat';
import { Reels } from './pages/Reels';
import { Explore } from './pages/Explore';
import { Search } from './cmps/Search';
import { Notifications } from './cmps/Notifications';
import { store } from './store/store';
import { PostDetails } from './cmps/PostDetails';
import { userService } from './services/user.service';
import { LoginSignup } from './pages/LoginSignup';
import './assets/styles/main.scss';

export function App() {

    const location = useLocation()
    console.log('App pathname:', location.pathname)

    const previousLocation = location.state?.previousLocation
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isOnLoginPage, setIsOnLoginPage] = useState(false);
    const loggedinUser = userService.getLoggedinUser();



    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (location.pathname.includes('/login')) setIsOnLoginPage(true)
        else setIsOnLoginPage(false)
    }, [location.pathname]);

    if (isLoading) return (
        <div className="loader-overlay" id="loader">
            <i className="loader-icon fa-brands fa-instagram"></i>
        </div>
    )

    return (
        <Provider store={store}>
            <section className={isOnLoginPage ? "login-layout app" : "main-layout app"}>
                {!isOnLoginPage ? <NavBar /> : <div></div>}
                <main>
                    <Routes location={previousLocation || location}>
                        <Route element={<HomePage />} path="/" />
                        <Route element={<Explore />} path="/explore" />
                        <Route element={<Reels />} path="/reels" />
                        <Route element={<Chat />} path="/chat" />
                        <Route element={<UserDetailsNew />} path="/user/:userId" />
                        <Route element={<Search />} path="/search" />
                        <Route element={<Notifications />} path="/notifications" />
                        <Route element={<LoginSignup />} path="/login" />
                    </Routes>
                    {previousLocation && (
                        <Routes>
                            <Route path="/post/:postId" element={<PostDetails lastPath={previousLocation.pathname} />} />
                        </Routes>
                    )}
                </main>
            </section>
        </Provider >
    )
}
