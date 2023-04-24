
document.querySelectorAll(".shareEvent").forEach((element, i) => {
    element.addEventListener("click", (e) => {
        alert("Sorry, share option is under work.");
    });
});

const home = document.querySelector(".home-icon");
if (home != undefined) {
    home.addEventListener("click", (e) => {
        location.href = "/";
    });
}


document.querySelectorAll(".copyToClipboardEvent").forEach((element, i) => {
    element.addEventListener("click", copyToClipboard);
    var copiedLogo = document.getElementById("copiedToClipboard" + i);
    copiedLogo.style.opacity = "0";
    copiedLogo.style.transition = "0";
});

function copyToClipboard(e) {
    var id = e.target.id;
    const idn = id.substring(15);
    var bodyElement = document.getElementById("postBody" + idn);
    var dedicationElement = document.getElementById("dedication" + idn);

    if (dedicationElement != null) {
        var dedication = dedicationElement.innerHTML;
        dedication = dedication.split("</span>");
        dedication = dedication[0].substring(20).trim();
    } else {
        var dedication = "None";
    }

    var body = bodyElement.innerHTML;
    body = body.trim();

    var str = "Dedication: " + dedication + "\nBody: " + body;
    //navigator.clipboard.writeText(str);

    copy(str);

    document.getElementById(id).style.display = "none";
    var copiedLogo = document.getElementById("copiedToClipboard" + idn);
    copiedLogo.style.transition = "1s";
    copiedLogo.style.opacity = "1";
}


function copy(text) {
    return new Promise((resolve, reject) => {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
            const type = "text/plain";
            const blob = new Blob([text], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.permissions.query({ name: "clipboard-write" }).then((permission) => {
                if (permission.state === "granted" || permission.state === "prompt") {
                    navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                }
                else {
                    reject(new Error("Permission not granted!"));
                }
            });
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            }
            catch (e) {
                document.body.removeChild(textarea);
                reject(e);
            }
        }
        else {
            reject(new Error("None of copying methods are supported by this browser!"));
        }
    });

}