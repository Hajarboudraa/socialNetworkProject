const postContent = document.getElementById("posts");
const username = document.querySelector(".card-header b");
const profilimg = document.querySelector(".card-header img");
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPae = 1;
let lastPage = 1;
setUpUi();

function getPosts(reload = true, page = 1) {
    toggleLoader(true);
    axios.get(`${baseUrl}/posts?limit=2&page=${page}`)
        .then(function(response) {
            var result = response.data.data;
            lastPage = response.data.meta.last_page;
            console.log(lastPage);
            toggleLoader(false)
            if (reload) {
                postContent.innerHTML = ""
            }
            for (let i = 0; i < result.length; i++) {
                //show or hide(edit) button
                let user = getCurrentUser()
                let isMyPost = user != null && result[i]["author"].id == user.id;
                let editBtnContent = "";
                let deletBtnContent = ""
                if (isMyPost) {
                    editBtnContent = `<button class="btn btn-secondary" style="float:right" onclick="editPost('${encodeURIComponent(JSON.stringify(result[i]))}')">Edit</button> `;
                    deletBtnContent = `<button class="btn btn-danger" style="float:right" onclick="deletePost('${encodeURIComponent(JSON.stringify(result[i]))}')">Delete</button> `;

                }
                let arrTags = ["Policy", "Sport", "Programming", "Hobbies", "Films", "Gaming", "Studies"]
                var randomNumber = Math.floor(Math.random() * arrTags.length);

                postContent.innerHTML += ` <div class="card shadow my-3">
             <h5 class="card-header">
               <span onclick="userClicked(${result[i].author.id})" style="cursor:pointer;">
                 <img src=${result[i]["author"].profile_image} alt="" style="width: 40px; height:40px" class="rounded-circle border border-2">
                 <b>@${result[i]["author"].username}</b>
                 </span>
                  ${deletBtnContent}${editBtnContent}
             
                 </h5> 
             <div class="card-body" style="cursor:pointer;" onclick="postClicked(${result[i].id})">
             <img src="${result[i].image}" alt="" class="w-100">
             <h6 style="color:lightgray ;" class="nt-1">${result[i].created_at}</h6>
             <h5 class="card-title">${result[i].title}</h5>
             <p class="card-text">${result[i].body}
             </p>
             <hr>
             <div>
             <i class="fa-solid fa-pen"></i>              
                <span>(${result[i].comments_count})comments</span>
                <span id=postsTags${i}>
                </span>

             </div>`;

                var spanTag = document.getElementById(`postsTags${i}`);
                // for (let j = 0; j < randomNumber; j++) {
                //     result[i].tags.push(arrTags[j]);

                // }
                // console.log(result[i].tags);
                // for (tag of result[i].tags) {
                //     spanTag.innerHTML += `<button class = "btn btn-sm rounded-5"
                // style = "background-color:gray;color:#fff" > ${tag} </button>`

                // }
            }
            // handle success
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })
        .finally(function() {
            // always executed
        });
}
getPosts();
// fetch("https://tarmeezacademy.com/api/v1/posts?limit=50")
//     .then(function(response) {
//         if (response.ok) {
//             console.log(response.text().data);


//         } else {
//             console.log("Mauvaise réponse du réseau");
//         }
//     })
//     .catch(function(error) {
//         console.log(
//             "Il y a eu un problème avec l'opération fetch : " + error.message,
//         );
//     });
// console.log(true + true);
// console.log(undefined + 1);
// console.log(null + 1);
//login 
const btnLog = document.getElementById("login");
btnLog.addEventListener("click", () => {
    toggleLoader(true)
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const params = {
        "username": username,
        "password": password
    }
    axios.post(`${baseUrl}/login`, params)
        .then(function(response) {
            toggleLoader(false)
                // console.log(response.data);
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("profilImg", response.data.user.profile_image)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            const modal = document.getElementById("loginModal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide();
            setUpUi()
            showSuccessAlert('Login Successfully!', 'success');

        }).catch(function(error) {
            // handle error
            console.log(error);
            const message = error.response.data.message;
            showSuccessAlert(message, 'danger')
        }).finally(function() {
            // always executed
            toggleLoader(false)
        });

})

function registerBtn() {
    // console.log("hekk");
    toggleLoader(true)
    const username = document.getElementById("usernameRegister").value;
    const password = document.getElementById("passwordRegister").value;
    const name = document.getElementById("nameRegister").value;
    const profile = document.getElementById("profieImg").files[0];

    let formData = new FormData();
    formData.append("username", username)
    formData.append("name", name)
    formData.append("password", password)
    formData.append("image", profile)

    //    const params = {
    //         "title": title,
    //         "body": body,
    //     }
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multi",
        // "authorization": `Bearer ${token}`
    }
    axios.post(`${baseUrl}/register`, formData, {
            headers: headers
        })
        .then(function(response) {
            console.log(response);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("profilImg", response.data.user.profile_image)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const modal = document.getElementById("registerModal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
                // modalInstance.hide();

            showSuccessAlert('New User Registred Successfully', 'success');
            setUpUi()
            getPosts();
        }).catch(function(error) {
            // handle error
            // handle error
            console.log(error);
            const message = error.response.data.message;
            showSuccessAlert(message, 'danger')
        })
        .finally(function() {
            // always executed
            toggleLoader(false)

        });



}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilImg");
    localStorage.removeItem("username")
        // alert("logout successufully")
        // document.getElementById("usern").style.display = "none";
        // document.getElementById("img").style.display = "none";

    setUpUi();
    showSuccessAlert('Logout Successufully', 'success');


}

function showSuccessAlert(message, type) {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    appendAlert(message, type)
        //hide alert
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
        // alert.close();
    }, 2000);
    // const alertTrigger = document.getElementById('liveAlertBtn')
    // if (alertTrigger) {
    //     alertTrigger.addEventListener('click', () => {
    //         appendAlert('Nice, you triggered this alert message!', 'success')
    //     })
    // }
}
console.log(localStorage.getItem("profilImg"));

function setUpUi() {
    const token = localStorage.getItem("token");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login-btn");
    const logoutDiv = document.getElementById("divLogout")
    var addBtn = document.getElementById("addBtn");
    const SendBtn = document.getElementById("addComment");

    if (token == null) {
        logoutDiv.style.setProperty("display", "none", "important");
        loginBtn.style.display = "inline";
        registerBtn.style.display = "inline";
        if (SendBtn != null) {
            SendBtn.style.display = "none";

        }
        if (addBtn != null) {
            addBtn.style.display = "none";
        }
        // document.getElementById("img").style.display = "none";
    } else {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutDiv.style.display = "flex";
        if (SendBtn != null) {
            SendBtn.style.display = "flex"

        }
        const user = getCurrentUser();
        document.getElementById("user").innerHTML = user.username;
        document.getElementById("profilim").src = user.profile_image;
        if (addBtn != null) {
            addBtn.style.display = "block";
        }
        // document.querySelector(".logout").innerHTML += `<span id="usern">@${userna}</span><img src=${profilim} id="img">
        //   <div><span>+</span></div>

        // `;


    }
}

function createPoste() {
    let postId = document.getElementById("post-id").value;
    let isCreate = postId == null || postId == "";
    const title = document.getElementById("titlePost").value;
    const body = document.getElementById("postBody").value;
    const img = document.getElementById("postImg").files[0];
    toggleLoader(true)

    let formData = new FormData();
    formData.append("body", body)
    formData.append("title", title)

    formData.append("image", img)
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multi",
        "authorization": `Bearer ${token}`
    }
    let url = ``;
    if (isCreate) {
        url = `${baseUrl}/posts`;
        // always executed

    } else {
        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`;

    }
    axios.post(url, formData, {
            headers: headers
        })
        .then(function(response) {
            console.log(response);
            const modal = document.getElementById("create-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide();
            showSuccessAlert('Post created Successfully!', 'success');
            getPosts();
        }).catch(function(error) {
            // handle error
            // handle error
            console.log(error);
            const message = error.response.data.message;
            showSuccessAlert(message, 'danger')
        })
        .finally(function() {
            // always executed
            toggleLoader(false)

        });
    // alert(postId)

    //    const params = {
    //         "title": title,
    //         "body": body,
    //     }


}

function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }
    return user
}
//Infinite Scroll
window.addEventListener("scroll", () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if (endOfPage && currentPae < 10) {
        currentPae++;
        getPosts(false, currentPae)
    }
    // console.log(endOfPage);
});
//end infinite scroll
function postClicked(postId) {
    // alert(postId)

    console.log(postId);
    window.location.href = `postDetails.html?postId=${postId}`;
}
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId");
console.log(id);
console.log(urlParams);
getPost();

function sendComment() {
    let commentInp = document.getElementById("inputComment").value;
    console.log(commentInp);
    let params = {
        "body": commentInp
    }
    let token = localStorage.getItem("token")
    axios.post(`${baseUrl}/posts/${id}/comments`, params, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        .then(function(response) {
            console.log(response.data);
            showSuccessAlert('comment adding Successfully!', 'success');
            getPost();

        }).catch(function(error) {
            // handle error
            console.log(error);
            const message = error.response.data.message;
            showSuccessAlert(message, 'danger')
        })
        .finally(function() {
            // always executed
        });
}

function getPost() {
    axios.get(`${baseUrl}/posts/${id}`)
        .then(function(response) {
            var post = response.data.data;
            const comments = post.comments;
            console.log(post.comments);
            const author = post.author;
            document.getElementById("postname").innerHTML = author.username;
            let commentsContent = ``;
            for (comment of comments) {
                commentsContent += ` <!--COMMENTS-->
                <div class="p-3" style="background:rgb(187,187,187)">
                    <!--Profile pic + username-->
                    <div>
                        <img src="${comment.author.profile_image}" alt="" class="rounded-circle" style="width:40px;height:40px">
                        <b>@${comment.author.username}</b>
                        <!--comments body-->
                        <div>${comment.body}</div>
                    </div>
                </div>
                <!--///COMMENTS-->
               `;
            }
            const postContent = ` <div class="card shadow my-3">

           <h5 class="card-header">
               <img src="${author.profile_image}" alt="" style="width: 40px; height:40px" class="rounded-circle border border-2">
               <b>@${author.username}</b>
           </h5>
           <div class="card-body">
               <img src="${post.image}" alt="" class="w-100">
               <h6 style="color:lightgray;" class="nt-1">${post.created_at}</h6>
               <h5 class="card-title">${post.title}</h5>
               <p class="card-text">${post.body}
               </p>
               <hr>
               <div>
                   <i class="fa fa-pen"></i>
                   <span>(${post.comments_count})comments</span>
               </div>
           </div>
           <div id="comments">
           ${commentsContent}
           <div style="width:100%" class="input-group mb-3" id="addComment">
           <input type="text" id="inputComment" placeholder="add your comment here.." class="form-control">
           <button onclick="sendComment()" class=" btn btn-outline-primary">Send</button>
           </div>
          </div>
       </div>`;
            document.getElementById("post").innerHTML = postContent;
            setUpUi()
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })
        .finally(function() {
            // always executed
        });
}
// Edit Post
function editPost(PostObj) {
    post = JSON.parse(decodeURIComponent(PostObj))
        // alert(post);
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle();
    document.getElementById("createBtn").innerHTML = "Update"
    document.getElementById("post-id").value = post.id;
    document.getElementById("titlePos").innerHTML = "Edit Post"
    document.getElementById("titlePost").value = post.title;
    document.getElementById("postBody").value = post.body;
    document.getElementById("postImg");
    console.log(document.getElementById("titlePos").innerHTML);
}
//Delete post
function deletePost(PostObj) {
    post = JSON.parse(decodeURIComponent(PostObj))
        // alert(post);
    document.getElementById("delete-id-post").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle();
    console.log(post)
        // alert('delete')
}
//-Add Post
function addBtnClicked() {
    // alert(post);

    document.getElementById("createBtn").innerHTML = "Create"
    document.getElementById("post-id").value = "";
    document.getElementById("titlePos").innerHTML = "Create A New Post"
    document.getElementById("titlePost").value = "";
    document.getElementById("postBody").value = "";
    document.getElementById("postImg");
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle();
}

function confirmDelete() {
    const postId = document.getElementById("delete-id-post").value;
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multi",
        "authorization": `Bearer ${token}`
    }
    axios.delete(`${baseUrl}/posts/${postId}`, {
            headers: headers
        })
        .then(function(response) {
            console.log(response);
            const modal = document.getElementById("delete-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide();
            showSuccessAlert('Post has been Delted Successfully!', 'success');
            getPosts()

        }).catch(function(error) {
            // handle error
            console.log(error);
            const message = error.response.data.message;
            showSuccessAlert(message, 'danger')
        })
        .finally(function() {
            // always executed
        });
}
getUser()
    //show user Profile
function getUser() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid");
    axios.get(`${baseUrl}/users/${id}`)
        .then(function(response) {
            var result = response.data.data;
            console.log(response);
            document.getElementById("mail").innerHTML = result.email;
            document.getElementById("nampr").innerHTML = result.name;
            document.getElementById("userp").innerHTML = result.username
            document.getElementById("commentcount").innerHTML = result.comments_count;
            document.getElementById("postcount").innerHTML = result.posts_count
            document.getElementById("imgP").src = result.profile_image
            document.getElementById("postusername").innerHTML = result.username
        })
}

function userClicked(id) {
    // alert(id);
    window.location.href = `profil.html?userid=${id}`
}

function profilClicked() {
    let user = getCurrentUser()
    console.log(user.id);
    window.location = `profil.html?userid=${user.id}`


}
//loader
function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible"
    } else {
        document.getElementById("loader").style.visibility = "hidden"

    }

}