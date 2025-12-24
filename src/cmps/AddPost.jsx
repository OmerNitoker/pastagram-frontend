import React, { useEffect, useState } from 'react'
import { cloudinaryService } from '../services/cloudinary-service.js'
import { postService } from '../services/post.service.js'
import { addPost } from '../store/actions/post.actions.js'
import { userService } from '../services/user.service.js'


export function AddPost({ setIsModalOpen, onCloseModal }) {
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser());
    const [newPost, setNewPost] = useState(postService.getEmptyPost());
    const [image, setImage] = useState('');

    useEffect(() => {
        const { _id, fullname, username, imgUrl } = loggedinUser;
        setNewPost(prevState => ({ ...prevState, by: { ...prevState.by, _id, fullname, username, imgUrl } }));
    }, [loggedinUser])

    function handleChange(ev) {
        const { target } = ev;
        if (target.type === 'textarea') {
            setNewPost(prevState => ({ ...prevState, txt: target.value }));
        } else if (target.type === 'file') {
            cloudinaryService.uploadImg(ev)
                .then(url => {
                    setImage(url);
                    setNewPost(prevState => ({ ...prevState, imgUrl: url }));
                })
                .catch(console.log('cannot upload image'));
        }
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        if (!newPost.imgUrl) return
        const postToAdd = { ...newPost }
        try {
            const addedPost = await addPost(postToAdd)
            const updatedUser = { ...loggedinUser, posts: [...loggedinUser.posts, addedPost._id] }
            await userService.update(updatedUser)
            setLoggedinUser(updatedUser)
            onCloseModal()
        } catch (err) {
            console.log('cannot add post: ', err)
            throw err
        }
    }

    return (
        <div className='modal-overlay' onClick={() => setIsModalOpen(false)}>
            <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header flex space-between">
                    <a onClick={onCloseModal} className="back-btn fs24">
                        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                    </a>
                    <span className='fw600'>Create new post</span>
                    <a onClick={handleSubmit} className='share-btn'>Share</a>
                </div>
                <div className="create-post-container">
                    <section className="img-section">
                        {image ? <img className='img-to-add' src={image} /> :
                            <div className="upload-preview flex column">
                                <i className="fa-regular fa-image"></i>
                                <label htmlFor="imgUpload">Upload Image</label>
                                <input type="file" accept="img/*" id="imgUpload" onChange={handleChange}></input>
                            </div>
                        }
                    </section>
                    <section className="post-info flex column">
                        <div className="post-user-info flex column">
                            <section className="flex">
                                <img className='user-avatar' src={loggedinUser.imgUrl} />
                                <span className='fw600 fs14'>{loggedinUser.username}</span>
                            </section>
                            <textarea onChange={handleChange} name="txt" id="txt" rows="10" placeholder='Write a caption...'></textarea>
                        </div>
                        <div className="post-info-footer"></div>
                    </section>
                </div>
            </div>
        </div>
    )
}
