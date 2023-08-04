const btnSendMessage = document.getElementById("btn-send-message");
const message = document.getElementById("messageBody");
const path = document.getElementById("custom-link-path");

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
