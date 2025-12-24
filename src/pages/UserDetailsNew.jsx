import { useSelector } from 'react-redux'
import { useState, useEffect } from "react";
import { UserPosts } from "../cmps/UserPosts";
import { UserPostsSaved } from "../cmps/UserPostsSaved";
import { UserTagged } from "../cmps/UserTagged";
import { SettingsIcon } from "../cmps/icons-cmps/SettingsIcon";
import { TaggedIcon } from "../cmps/icons-cmps/TaggedIcon";
import { userService } from '../services/user.service';
import { TableIcon } from '../cmps/icons-cmps/TableIcon';
import { SaveIcon } from '../cmps/icons-cmps/SaveIcon';
import { loadPosts } from '../store/actions/post.actions';
import { useParams } from 'react-router';

export function UserDetailsNew() {
    const posts = useSelector((storeState) => storeState.postModule.posts)
    const { userId } = useParams()
    // const currentUser = userService.getLoggedinUser()
    const [userToShow, setUserToShow] = useState(null)
    const [activeComponent, setActiveComponent] = useState(<UserPosts user={userToShow} posts={posts} />);
    // const [activeComponent, setActiveComponent] = useState(null);
    const [activeTab, setActiveTab] = useState('UserPosts');

    // useEffect(() => {
    //     fetchData()
    // }, [])

    // async function fetchData() {
    //     try {
    //         if(!posts.length) {
    //             await loadPosts()
    //         }
    //         if(!userToShow) {
    //             const user = await userService.getById(userId)
    //             setUserToShow(user)
    //         }
    //     } catch (err) {
    //         console.log('Failed to fetch data')
    //         throw err
    //     }
    // }

    useEffect(() => {
        if (!posts.length) {
            const fetchData = async () => {
                try {
                    await loadPosts()
                } catch (err) {
                    console.log('err:', err)
                }
            }
            fetchData()
        }
    }, [userId])

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await userService.getById(userId)
                setUserToShow(user)
                setActiveComponent(getActiveComponent(activeTab, user, posts))
            }
            catch (err) {
                console.log('could not find user:', err)
            }
        }
        fetchUser()
    }, [activeTab])

    useEffect(() => {
        setActiveComponent(getActiveComponent(activeTab, userToShow, posts));
    }, [activeTab]);

    const handleComponentChange = (componentName) => {
        setActiveTab(componentName);
    };

    const getActiveComponent = (componentName, user = { userToShow }, posts = { posts }) => {
        switch (componentName) {
            case 'UserPosts':
                return <UserPosts user={user} posts={posts} />;
            case 'UserPostsSaved':
                return <UserPostsSaved currentUser={user} posts={posts} />;
            case 'UserTagged':
                return <UserTagged />;
            default:
                return <UserPosts user={user} />;
        }
    }

    if (!userToShow || !posts.length) return <div></div>
    return (
        <section className="user-profile">
            <div className="profile-info">
                <img className="user-profile-avatar user-avatar" src={userToShow.imgUrl} alt={`${userToShow.fullname}'s avatar`} />
                <div className="user-details">

                    <div className="user-profile-btns">
                        <span>{userToShow.username}</span>
                        <span> <button className="follow-btn">Edit profile </button></span>
                        <span><button className="message-btn">View archive</button></span>
                        <span><SettingsIcon /></span>
                    </div>

                    <div className="user-stats">
                        <span className="user-num-posts">{userToShow.posts ? userToShow.posts.length : 'Loading...'} posts</span>
                        {/* <span className="user-num-followers">{userToShow.followers ? Object.keys(userToShow.followers).length : 'Loading...'} followers</span> */}
                        <span className="user-num-followers">{userToShow.followers} followers</span>
                        <span className="user-num-following">{userToShow.following} following</span>
                        {/* <span className="user-num-following">{userToShow.following ? Object.keys(userToShow.following).length : 'Loading...'} following</span> */}
                    </div>
                    <div className="userprofile-description">
                        <div className="user-profile-fullname">
                            {userToShow.fullname}
                        </div>
                        <div className="user-profile-description">
                            {userToShow.description}

                        </div>
                    </div>
                </div>
            </div>

            <section className="user-posts-detail">
                <div className={`user-publications ${activeTab === 'UserPosts' ? 'active' : ''}`} onClick={() => handleComponentChange('UserPosts')}><TableIcon /> POSTS</div>
                <div className={`user-posts-saved ${activeTab === 'UserPostsSaved' ? 'active' : ''}`} onClick={() => handleComponentChange('UserPostsSaved')}><SaveIcon /> SAVED</div>
                <div className={`user-posts-tagged ${activeTab === 'UserTagged' ? 'active' : ''}`} onClick={() => handleComponentChange('UserTagged')}><TaggedIcon /> TAGGED</div>

            </section>
            <div className="active-component">
                {activeComponent}
            </div>
        </section>
    )
}
