const btnSendMessage = document.getElementById("btn-send-message");
const message = document.getElementById("messageBody");
const path = document.getElementById("custom-link-path");


// if (btnSendMessage != null) {
//     btnSendMessage.onclick = () => {

//         const url = "http://localhost:3001/custompath/" + path.innerHTML.trim() + "?serial=" + btnSendMessage.value;

//         postData(url, { directedMessage: message.value }).then((data) => {
//             //window.location.replace("/");
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