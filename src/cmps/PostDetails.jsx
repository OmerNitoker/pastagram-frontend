import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { utilService } from "../services/util.service"
import { postService } from "../services/post.service"
import { userService } from "../services/user.service"
import { removePost, setCurrPost } from "../store/actions/post.actions"
import { PostMenu } from "./PostMenu"

export function PostDetails({ lastPath }) {
    const navigate = useNavigate()

    const currentUser = userService.getLoggedinUser()

    const [post, setPost] = useState(null)
    const [isPostMenuOpen, setIsPostMenuOpen] = useState(false)
    const likedByIndex = post ? post.likedBy.findIndex(user => user._id === currentUser._id) : null
    const [hoveredComment, setHoveredComment] = useState(null)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEmojis, setShowEmojis] = useState(false)
    const [newCommentText, setNewCommentText] = useState("")
    const [commentTimestamp, setCommentTimestamp] = useState(Date.now())
    const [isEmptyComment, setIsEmptyComment] = useState(true)
    const [isLiked, setIsLiked] = useState(false)

    const emojis = ['😀', '😍', '👍', '❤️', '😂', '🎉', '🔥', '😊', '🙌', '😎']
    const { postId } = useParams()

    useEffect(() => {
        if (likedByIndex !== -1 && likedByIndex !== null) {
            setIsLiked(true)
        }
    }, [likedByIndex])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const currPost = await postService.getById(postId)
                if (!currPost) console.log('Failed to find post')
                else setPost(currPost)
            } catch (err) {
                console.log('Had a problem fetching post from DB')
                throw err
            }
        }
        fetchPost()
    }, [])

    async function onRemovePost(postId) {
        try {
            await removePost(postId)
            setIsPostMenuOpen(false)
        }
        catch (err) {
            console.log('Cannot delete post: ', err)
            throw err
        }
    }

    const handleLikeClick = async () => {

        const updatedPost = { ...post }

        if (!isLiked) {
            const likedUser = {
                _id: currentUser._id,
                fullname: currentUser.fullname,
                imgUrl: currentUser.imgUrl
            }

            updatedPost.likedBy.push(likedUser)
        } else {
            const index = updatedPost.likedBy.findIndex(user => user._id === currentUser._id)
            if (index !== -1) {
                updatedPost.likedBy.splice(index, 1)
            }
        }

        try {
            await postService.save(updatedPost)
            setIsLiked(!isLiked)
        }
        catch (err) {
            console.log('could not save updated post')
            throw err
        }
    }

    function togglePostMenu() {
        setIsPostMenuOpen(!isPostMenuOpen)
    }

    function generateId() {
        return utilService.makeId()
    }

    const handleCommentMouseEnter = (commentId) => {
        setHoveredComment(commentId)
    }

    const handleCommentMouseLeave = () => {
        setHoveredComment(null)
    }

    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId)
        setShowDeleteModal(true)
    }

    function toggleDeleteModal() {
        setShowDeleteModal(false)
    }

    const confirmDeleteComment = async () => {
        if (commentToDelete) {
            const updatedPost = { ...post }
            const commentIndex = updatedPost.comments.findIndex(comment => comment._id === commentToDelete)

            if (commentIndex !== -1) {
                updatedPost.comments.splice(commentIndex, 1)
                await postService.save(updatedPost)
                setShowDeleteModal(false)
            }
        }
    }

    const cancelDeleteComment = () => {
        setShowDeleteModal(false)
        setCommentToDelete(null)
    }

    const toggleEmojis = () => {
        setShowEmojis(!showEmojis)
    }

    const addEmojiToComment = (emoji) => {
        setNewCommentText((prevText) => prevText + emoji)
        toggleEmojis()
    }

    const handleCommentChange = (e) => {
        const comment = e.target.value
        setNewCommentText(comment)
        setCommentTimestamp(Date.now())
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

        post.comments.unshift(newComment)
        setNewCommentText("")
        setIsEmptyComment(true)

        await postService.save(post)
    }

    function handleWraperClicked() {
        setPost(null)
        setIsLiked(false)
        navigate(`${lastPath}`)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCommentSubmit(event)
        }
    }

    if (!post) return (
        <span></span>
    )

    return (
        <div className="details-container">
            <div className="modal-overlay" onClick={handleWraperClicked}>
                <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
                    <img className="modal-post-img" src={post.imgUrl} alt="post-img" />
                    <div className="comments-section">
                        <section className="post-modal-header flex align-center">
                            <img className="modal-user-avatar" src={post.by.imgUrl} />
                            <Link className="clean-link fw600 fg1">{post.by.username}</Link>
                            <i onClick={togglePostMenu} className="fa-solid fa-ellipsis post-menu-btn"></i>
                            <i className="fa-solid fa-x close-btn" onClick={handleWraperClicked}></i>
                        </section>
                        <ul className="comments-list">
                            <li key={generateId} className="comment-item first-comment">
                                <img src={post.by.imgUrl} alt={post.by.fullname} className="user-avatar comment-avatar" />
                                <div className="comment-content">
                                    <div className="username-txt">
                                        <Link className="clean-link fw600 mr05">{post.by.username}</Link>
                                        <span className="comment-text">{post.txt}</span>
                                    </div>
                                    <div className="comment-actions">
                                        <span className="comment-time">1h</span>
                                    </div>
                                </div>
                            </li>
                            {post.comments.map(comment => (
                                <li
                                    key={comment._id}
                                    className="comment-item"
                                    onMouseEnter={() => handleCommentMouseEnter(comment._id)}
                                    onMouseLeave={handleCommentMouseLeave}
                                >
                                    <img src={comment.by.imgUrl} alt={comment.by.fullname} className="user-avatar comment-avatar" />
                                    <div className="comment-content">
                                        <div className="username-txt">
                                            <Link className="clean-link fw600 mr05">{comment.by.username}</Link>
                                            <span className="comment-text">{comment.txt}</span>
                                        </div>
                                        <div className="comment-actions">
                                            <span className="comment-time">{utilService.getTimeAgo(comment.timestamp)}</span>
                                            {hoveredComment === comment._id && (
                                                <i className="fa-solid fa-ellipsis comment-delete-btn" onClick={() => handleDeleteComment(comment._id)}></i>
                                            )}
                                        </div>
                                    </div>
                                    <i className="fa-regular fa-heart comment-like-btn"></i>
                                </li>
                            ))}

                        </ul>
                        <div className="details-footer-container">
                            <div className="btn-container flex align-center">
                                <div className="like" onClick={handleLikeClick} style={{ color: isLiked ? 'red' : 'black' }}>
                                    {!isLiked ?
                                        <i className="fa-regular fa-heart"></i>
                                        : <i className="fa-solid fa-heart like"></i>}
                                </div>
                                <i className="fa-regular fa-comment"></i>
                                <i className="fa-regular fa-paper-plane share-post-btn"></i>
                                <i className="fa-regular fa-bookmark save-btn" ></i>
                            </div>
                            <div className="likes-time">
                                {post.likedBy.length ?
                                    <a className="clean-link fw600">
                                        {post.likedBy.length} {post.likedBy.length > 1 ? 'likes' : 'like'}
                                    </a> :
                                    <span>be the first to <span className="fw600 cp" onClick={handleLikeClick}>like this</span></span>
                                }
                                <span>1 hour ago</span>
                            </div>
                        </div>
                        {showDeleteModal && (
                            <div className="modal-overlay" onClick={toggleDeleteModal}>
                                <div className="modal-content delete-comment-modal">
                                    <button className="delete-definitivly-comments-btn clean-btn" onClick={confirmDeleteComment}>Delete</button>
                                    <button className="cancel-delete-comments-btn clean-btn" onClick={cancelDeleteComment}>Cancel</button>
                                </div>
                            </div>
                        )}
                        <div className="comment-input-container">
                            <div className="emojis">
                                <i className="fa-regular fa-face-smile" onClick={toggleEmojis}></i>
                                {showEmojis && (
                                    <div className="emoji-list">
                                        {emojis.map((emoji, index) => (
                                            <span key={index} onClick={() => addEmojiToComment(emoji)}>
                                                {emoji}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="comment-input"
                                onKeyPress={handleKeyPress}
                                value={newCommentText}
                                onChange={handleCommentChange}
                            />
                            <button className={`comment-btn ${isEmptyComment ? '' : 'comment-btn-full'}`} onClick={handleCommentSubmit}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
            {(isPostMenuOpen && post.by._id === currentUser._id) &&
                <PostMenu
                    post={post}
                    setIsPostMenuOpen={setIsPostMenuOpen}
                    onRemovePost={onRemovePost}
                />}
        </div>
    )
}