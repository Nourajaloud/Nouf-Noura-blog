//define variables 
const url = "https://aqueous-chamber-95142.herokuapp.com/users/nouf-alshehri/posts"
const container = document.getElementById('post-container');
let editedPostId = "";

/***************API Queries****************/
/*********display posts********/

renderPostsToHTML(url)
function renderPostsToHTML(url) {
    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(response => {
            console.log(response)
            let postsElements = ""
            posts = response.posts
            for (let post of posts) {
                postsElements += `
                        <div class="col-lg-3 col-md-3 col-sm-5 col-11 card">
                            <div class="post-img">
                            <img class="card-img-top" src="${post.image}"></div>
                            <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                            <a href="javascript:void(0)" class="btn btn-light post-btns" id="comments-btn" onclick="getComments(${post.id}) "><i class="fas fa-comments "></i>
                            </a>
                            <a href="#" onclick="deletePost(${post.id})" class="btn btn-light post-btns"><i class="fas fa-trash-alt"></i>
                            </a>
                            <a href="#"  class="btn btn-light post-btns" onclick="editPopUp(); editedPostId=${post.id}"><i class="far fa-edit"></i></i>
                            </a>
                            </div>
                
                        </div>
                            `
            }
            container.innerHTML = postsElements
        })
        .catch(err => console.log(err.message))
}


/****Create A New Post******/

function createNewPost(newPost) {
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
        .then(response => {
            if (response.status == 201)
                return response.json()
            else
                throw new Error("error updating")
        })
        .then(() => {
            renderPostsToHTML(url)
        })
        .catch(err => {
            console.log(err.message)
        })
}


/*******Update An Existing Post*****/
function updatePost(toBeUpdatedPost, postId) {
    const updateUrl = url + '/' + postId
    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(toBeUpdatedPost)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else
                throw new Error("error!!!!")
        })
        .then(() => {
            renderPostsToHTML(url)
        })
        .catch(err => {
            console.log(err.message)
        })
}

/*******Delete A Post ******/
function deletePost(postId) {
    const deleteUrl = url + '/' + postId
    fetch(deleteUrl, {
        method: "DELETE"
    })
        .then(function () {
            renderPostsToHTML(url)
        })
}

/*******Search for A Post ******/
function searchPost(term) {
    const searchPostUrl = url + '/search/';
    const serachUrl = searchPostUrl + term;
    try {
        const encoded = encodeURI(serachUrl);
        renderPostsToHTML(encoded)
    }
    catch (e) { // catches a malformed URI
        console.error("invalid search term");
    }
}

/*******Get Post Comments ******/
function getComments(postId) {
    let commentsSection = document.getElementById("comments-section")
    const commentsUrl = url + "/" + postId + "/comments"
    fetch(commentsUrl)
        .then(response => {
            return response.json()
        })
        .then(response => {
            let commentElements = ""
            for (let comment of response) {
                commentElements += `
                <div class="comment-design"> 
                <h5> ${comment.name} </h5> 
                <p> ${comment.text} </p> 
                </div>`
            }
            commentsSection.innerHTML = commentElements
        })
        .catch(err => console.log(err.message))
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}


/************DOM**************/

//search for a post event
// Get the input field
var input = document.getElementById("search-text");
var searchButton = document.getElementById("search-btn");
let editForm = document.getElementById("edit-form");
let addForm = document.getElementById("add-form");


// on clicking the search icon
searchButton.addEventListener('click', function (e) {
    e.preventDefault()
    searchPost(input.value)

});
// on pressing the enter key
input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        searchPost(input.value)
    }
});

//prevent the website referesh when pressing enter
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
    }
});


// Update post information
editForm.addEventListener("submit", e => {
    e.preventDefault()
    const formElements = e.target.elements
    const title = formElements.title.value
    const body = formElements.body.value
    let image = formElements.image.value
    if (image === "") {
        image = "https://images.pexels.com/photos/5472571/pexels-photo-5472571.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
    }
    const updatedPost = {
        title: title,
        body: body,
        image: image
    }
    updatePost(updatedPost, editedPostId)

    // close the pop-up window 
    document.getElementById('light-edit').style.display = 'none';
    document.getElementById('fade').style.display = 'none'

});


// Add new post in HTML
addForm.addEventListener("submit", e => {
    e.preventDefault()
    const formElements = e.target.elements
    const title = formElements.title.value
    const body = formElements.body.value
    let image = formElements.image.value
    if (image === "") {
        image = "https://images.pexels.com/photos/5472571/pexels-photo-5472571.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
    }
    const newPost = {
        title: title,
        body: body,
        image: image
    }
    console.log(newPost)
    createNewPost(newPost)

    // close the pop-up window 
    document.getElementById('light-add').style.display = 'none';
    document.getElementById('fade').style.display = 'none'
})


// Open add pop-up
function addPopUp() {
    document.getElementById('light-add').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}

//edit pop-up
function editPopUp() {
    document.getElementById('light-edit').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}


