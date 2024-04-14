import { useSelector } from 'react-redux'
import { useState } from "react";

import { UserPosts } from "../cmps/UserPosts";
import { UserPostsSaved } from "../cmps/UserPostsSaved";
import { UserTagged } from "../cmps/UserTagged";
import { SettingsIcon } from "../cmps/icons-cmps/SettingsIcon";
import { TaggedIcon } from "../cmps/icons-cmps/TaggedIcon";

export function UserDetails() {
    const currentUser = useSelector((storeState) => storeState.userModule.loggedinUser)
    
    const [activeComponent, setActiveComponent] = useState(<UserPosts currentUser={currentUser} />); // Initialisez activeComponent avec UserPosts
    const [activeTab, setActiveTab] = useState('UserPosts');

    // const userDemo = userService.getDemoUser();

    const handleComponentChange = (componentName) => {
        setActiveTab(componentName);

        switch (componentName) {
            case 'UserPosts':
                setActiveComponent(<UserPosts user={currentUser} />);
                break;
            case 'UserPostsSaved':
                setActiveComponent(<UserPostsSaved />);
                break;
            case 'UserTagged':
                setActiveComponent(<UserTagged />);
                break;
            default:
                setActiveComponent(<UserPosts user={currentUser} />);
                break;
        }
    };


    return (
        <section className="user-profile">
            <div className="profile-info">
                <img className="user-profile-avatar" src={currentUser.imgUrl} alt={`${currentUser.fullname}'s avatar`} />
                <div className="user-details">

                    <div className="user-profile-btns">
                        <span>{currentUser.username}</span>
                        <span> <button className="follow-btn">Edit profile </button></span>
                        <span><button className="message-btn">View archive</button></span>
                        <span><SettingsIcon /></span> 
                    </div>
                    
                    <div className="user-stats">
                        <span className="user-num-posts">{currentUser.posts ? currentUser.posts.length : 'Loading...'} posts</span>
                        <span className="user-num-followers">{currentUser.followers ? Object.keys(currentUser.followers).length : 'Loading...'} followers</span>
                        <span className="user-num-following">{currentUser.following ? Object.keys(currentUser.following).length : 'Loading...'} following</span>
                    </div>
                    <h2 className="userprofile-fullName">{currentUser.fullname}</h2>
                </div>
            </div>

            <section className="user-posts-detail">
                <div className={`user-publications ${activeTab === 'UserPosts' ? 'active' : ''}`} onClick={() => handleComponentChange('UserPosts')}><i className="fa-solid fa-table-cells"></i> Posts</div>
                <div className={`user-posts-saved ${activeTab === 'UserPostsSaved' ? 'active' : ''}`} onClick={() => handleComponentChange('UserPostsSaved')}><i className="fa-regular fa-bookmark"></i> Saved</div>
                <div className={`user-posts-tagged ${activeTab === 'UserTagged' ? 'active' : ''}`} onClick={() => handleComponentChange('UserTagged')}><TaggedIcon /> Tagged</div>

            </section>
            <div className="active-component">
                {activeComponent}
            </div>
        </section>
    )
}
