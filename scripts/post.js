
var postBtn = document.getElementById("btn-post-secret");
var dedicateTo = document.getElementById("postDedicateTo");
var postBody = document.getElementById("postBody");
var uploadSuccess = document.querySelector(".upload-success");
var divPostForm = document.querySelector(".div-post-form");

// if (postBtn != null) {
//     postBtn.onclick = () => {
//         var dedication;
//         var body = postBody.value;

//         if (dedicateTo != null) {
//             dedication = dedicateTo.value;
//         }
//         postData("http://localhost:3001/post", { dedicateTo: dedication, postBody: body }).then((data) => {
//             window.location.replace("/post?success=true");
//         });

//     }
// }

async function postData(url = "", data) {

    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

