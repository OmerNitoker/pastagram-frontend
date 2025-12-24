import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
// import { gPosts } from "../services/post.service";

export function UserPostsSaved({ currentUser, posts }) {
  const [savedPosts, setSavedPosts] = useState([]);

  // const location = useLocation()
  
    useEffect(() => {

      if (currentUser && currentUser.savedPostIds) {
        const postsToSave = currentUser.savedPostIds.map(postId => {
          console.log('postId', postId)
          const post = posts.find(p => p._id === postId);
          if (!post) {
            console.log(`Post with ID ${postId} not found`);
            return null; // Ignore IDs of posts not found
          }
          console.log('post: ', post)
          return post;
        }).filter(Boolean);
    
        setSavedPosts(postsToSave);
    
        // Calculer le nombre de lignes nécessaires pour la grille
        const rowCount = Math.ceil(postsToSave.length / 3);
        
        // Mettre à jour la variable CSS
        document.documentElement.style.setProperty('--saved-grid-rows', rowCount);
      }
    }, [currentUser]);
      

  if (!savedPosts.length) {
    return <div>Loading saved posts...</div>;
  }

  return (
    <div>
      <div className="saved-posts-container">
        {savedPosts.map(post => (
          <div key={post._id} className="saved-post-item">
            <img src={post.imgUrl} alt={post.txt} className="saved-post-image" />
          </div>
        ))}
      </div>
    </div>
  );
}
