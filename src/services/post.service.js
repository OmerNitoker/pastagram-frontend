import { storageService } from "./async-storage.service"
import { httpService } from "./http.service"
import { utilService } from "./util.service"

const STORAGE_KEY = 'post'
const BASE_URL = 'post/'

export const postService = {
  query,
  getById,
  remove,
  save,
  getEmptyPost
}


// const gPosts = [
//   {
//     _id: "s1253",
//     timestamp: Date.now() - utilService.getRandomIntInclusive(0, 87000000),
//     txt: "",
//     imgUrl: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1713415368/insta-project/pasagram%20posts/flavor%20fiesta%20cafe/19_gte2hv.jpg",
//     by: {
//       _id: "u101",
//       fullname: "Mug Life Cafe",
//       username: "Mug Life Cafe",
//       imgUrl: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1713612736/insta-project/pasagram%20posts/flavor%20fiesta%20cafe/MugLife_logo_uyde6w.png"
//     },
//     comments: [],
//     likedBy: new Array(utilService.getRandomIntInclusive(200, 1500)).fill({ _id: utilService.makeId() }),
//     tags: []
//   },
//   {
//     _id: "s1254",
//     timestamp: Date.now() - utilService.getRandomIntInclusive(0, 87000000),
//     txt: "",
//     imgUrl: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1713415354/insta-project/pasagram%20posts/flavor%20fiesta%20cafe/20_uxrydu.jpg",
//     by: {
//       _id: "u101",
//       fullname: "Mug Life Cafe",
//       username: "Mug Life Cafe",
//       imgUrl: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1713612736/insta-project/pasagram%20posts/flavor%20fiesta%20cafe/MugLife_logo_uyde6w.png"
//     },
//     comments: [],
//     likedBy: new Array(utilService.getRandomIntInclusive(200, 1500)).fill({ _id: utilService.makeId() }),
//     tags: []
//   },
// ]

// _createPosts()

async function query() {
  return httpService.get(BASE_URL)
//   var posts = await storageService.query(STORAGE_KEY)
//   return posts
}

function getById(postId) {
  // return storageService.get(STORAGE_KEY, postId)
  return httpService.get(BASE_URL + postId)
}

async function remove(postId) {
  // await storageService.remove(STORAGE_KEY, postId)
  return httpService.delete(BASE_URL + postId)
}

async function save(post) {
  var savedPost;
  if (post._id) {
    // savedPost = await storageService.put(STORAGE_KEY, post);
    savedPost = await httpService.put(BASE_URL, post)
  } else {
    // post.host = userService.getLoggedinUser();
    // post.comments.forEach(comment => {
    //   if (!comment.timestamp) {
    //     comment.timestamp = Date.now() - utilService.getRandomIntInclusive(0,87000000) - (24 * 60 * 60 * 1000); // 1 jour en millisecondes
    //   }
    // });

    // savedPost = await storageService.post(STORAGE_KEY, post);
    savedPost = await httpService.post(BASE_URL, post)
  }
  return savedPost
}

function _createPosts() {
  let posts = utilService.loadFromStorage(STORAGE_KEY);
  if (!posts || !posts.length) {
    posts = gPosts;

    posts.forEach(post => {
      post.comments.forEach(comment => {
        comment.timestamp = utilService.getRandomIntInclusive(post.timestamp, Date.now());
      });
    });

    utilService.saveToStorage(STORAGE_KEY, posts);
  }
}

function getEmptyPost() {
  return {
    //_id: utilService.makeId(),
    txt: '',
    imgUrl: '',
    by: {
      _id: '',
      fullname: '',
      username: '',
      imgUrl: ''
    },
    comments: [],
    likedBy: [],
    tags: [],
    timestamp: Date.now()
  }
}





