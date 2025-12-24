import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { postService } from "../services/post.service";
import { userService } from "../services/user.service"; // Assurez-vous d'importer userService si vous l'utilisez
import { PostMenu } from "./PostMenu";
import { utilService } from "../services/util.service";

export function PostPreview({ post, currentUser, onRemovePost, onUpdatePost }) {
    const likedByIdx = post.likedBy.findIndex(user => user._id === currentUser._id);
    const [isPostMenuOpen, setIsPostMenuOpen] = useState(false)
    const [isLikePost, setIsLikePost] = useState(false)
    const [isSaved, setIsSaved] = useState(currentUser.savedPostIds ? currentUser.savedPostIds.includes(post._id) : false);
    const [isEmptyComment, setIsEmptyComment] = useState(true)
    const [newCommentText, setNewCommentText] = useState("")
    const [commentTimestamp, setCommentTimestamp] = useState(Date.now())

    const location = useLocation();

    useEffect(() => {
        if (likedByIdx !== -1) {
            setIsLikePost(true);
        }
        else {
            setIsLikePost(false)
        }
    }, [likedByIdx])

    function togglePostMenu() {
        console.log('post by user:', post.by._id)
        console.log('userId:', currentUser._id)
        if (post.by._id === currentUser._id) setIsPostMenuOpen(!isPostMenuOpen)
        else if (isPostMenuOpen) setIsPostMenuOpen(!isPostMenuOpen)
    }

    const handleLikeClick = async () => {
        const updatedPost = { ...post };

        if (!isLikePost) {
            const likedUser = {
                _id: currentUser._id,
                fullname: currentUser.fullname,
                imgUrl: currentUser.imgUrl
            }

            updatedPost.likedBy.push(likedUser);
        } else {
            const index = updatedPost.likedBy.findIndex(user => user._id === currentUser._id); // Recherchez l'utilisateur démo
            if (index !== -1) {
                updatedPost.likedBy.splice(index, 1);
            }
        }

        try {
            await postService.save(updatedPost)
        }
        catch (err) {
            console.log('could not save updated post')
            throw err
        }
        finally {
            setIsLikePost(!isLikePost)
        }
    }

    const handleCommentChange = (e) => {
        const comment = e.target.value
        setNewCommentText(comment);
        setCommentTimestamp(Date.now());
        if (comment.length) {
            setIsEmptyComment(false)
        }
        else {
            setIsEmptyComment(true)
        }
    }

    const handleCommentSubmit = async () => {
        if (newCommentText.trim() === "") {
            return
        }

        const newComment = {
            _id: utilService.makeId(),
            by: {
                _id: currentUser._id,
                fullname: currentUser.fullname,
                username: currentUser.username,
                imgUrl: currentUser.imgUrl
            },
            txt: newCommentText,
            timestamp: Date.now()
        }

        post.comments.push(newComment)
        setNewCommentText("");
        setIsEmptyComment(true)

        await postService.save(post)
    }

    const handleSaveClick = () => {
        const updatedUser = { ...currentUser }
        const postIndex = updatedUser.savedPostIds.length ? updatedUser.savedPostIds.indexOf(post._id) : -1
        if (postIndex === -1) {
            updatedUser.savedPostIds.push(post._id)
            setIsSaved(true)
            userService.update(updatedUser)
                .then(updatedUser => {
                    // alert('Post saved successfully!');
                })
                .catch(error => {
                    // alert('Error saving post.');
                });
        } else {
            updatedUser.savedPostIds.splice(postIndex, 1);
            setIsSaved(false); // Met à jour l'état pour indiquer que le post n'est plus sauvegardé
            userService.update(updatedUser)
                .then(updatedUser => {
                    console.log('User updated:', updatedUser);
                    alert('Post removed from saved posts!');
                })
                .catch(error => {
                    console.error('Error removing post:', error);
                    alert('Error removing post.');
                });
        }
    };


    const timeAgo = utilService.getTimeAgo(post.timestamp);
    
    return (
        <article className="post-preview flex column fs14">

            <section className="post-header flex align-center">
                <img className="user-avatar" src={post.by.imgUrl} />
                <Link to={`/user/${post.by._id}`} className="clean-link fw600">{post.by.username}</Link>
                <div className="post-time">• {timeAgo}</div>
                <i onClick={togglePostMenu} className="fa-solid fa-ellipsis "></i>
            </section>

            <img className="post-img" src={post.imgUrl} alt="post-img" />

            <section className="post-footer flex column">


                <div className="btn-container flex align-center">
                    <div className="like" onClick={handleLikeClick} style={{ color: isLikePost ? 'red' : 'black' }}>
                        {!isLikePost ? <i className="fa-regular fa-heart"></i> : <i className="fa-solid fa-heart like"></i>}
                    </div>
                    <Link className="clean-link" to={`/post/${post._id}`} state={{ previousLocation: location }}>
                        <i className="fa-regular fa-comment"></i>
                    </Link>
                    <i className="fa-regular fa-paper-plane share-post-btn"></i>
                    <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`} onClick={handleSaveClick}></i>
                </div>

                {post.likedBy.length ? <span className="num-of-likes">{post.likedBy.length} {post.likedBy.length === 1 ? 'Like' : 'Likes'}</span> : <span></span>}
                <div>
                    <Link className="clean-link fw600">{post.by.username}</Link>
                    <span className="story-txt">{post.txt}</span>
                </div>
                <Link
                    className="clean-link"
                    to={`/post/${post._id}`}
                    state={{ previousLocation: location }}>
                    {post.comments.length ? <span className="clr-gray cp">{post.comments.length > 1 ? `View all ${post.comments.length} comments` : `View 1 comment`}</span> : <span></span>}
                </Link>
                <div className="flex">

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="comment-input"
                        value={newCommentText}
                        onChange={handleCommentChange}
                    />
                    <button className={`comment-btn ${isEmptyComment ? 'hidden' : 'comment-btn-full'}`} onClick={handleCommentSubmit}>Post</button>
                </div>
                {/* <textarea name="add-comment" id="add-comment" placeholder="Add a comment..."></textarea> */}
            </section>

            {/* {isModalOpen &&
                <PostDetails
                    handleLikeClick={handleLikeClick}
                    isLiked={isLiked}
                />} */}
            {isPostMenuOpen && 
                <PostMenu
                    post={post}
                    setIsPostMenuOpen={setIsPostMenuOpen}
                    onRemovePost={onRemovePost}
                />}
        </article>
    )
}
