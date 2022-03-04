const submitButton = document.getElementById("submit");
const emailInput = document.getElementById("email");
const emailDiv = document.getElementById("emailDiv");
const username = document.getElementById("userEmail");
const usersContainer = document.getElementById("usersContainer");
const prodContainer = document.getElementById("prodContainer")
const chat = document.getElementById("chat");
const newProd = document.getElementById("newProd");
const sendProd = document.getElementById("sendProd");
const prodName = document.getElementById("name");
const prodPrice = document.getElementById("price");
const prodThumbnail = document.getElementById("thumbnail");
const msgsContainer = document.getElementById("msgsContainer");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

const user = {};
let users = [];
const prods = [];
chat.style.visibility = "hidden";
newProd.style.visibility = "hidden";

submitButton.addEventListener("click", () => {

    if (emailInput.value.includes("@")) {

        emailDiv.innerHTML = null;
        newProd.style.visibility = "visible";
        chat.style.visibility = "visible";
        user.email = emailInput.value;

        username.innerHTML = user.email;

        user.socket = io();

        user.socket.emit("userEmail", user.email);
        user.socket.on("users", renderUser);
        user.socket.on("offline", deleteUser);
        user.socket.on("prods", renderProds);
        user.socket.on("message", render);

        renderUserList();

        sendProd.addEventListener("click", addProd);
        sendBtn.addEventListener("click", msgManager);

    }
});

function renderUser(u) {

    if (u.email === user.email) {
        return;
    }

    users.push(u);

    renderUserList();

}

function renderUserList() {

    usersContainer.innerHTML = null;
    let html;

    fetch("../static/hbs/users.hbs")
        .then(response => response.text())
        .then(hbsTemplate => {

            const template = Handlebars.compile(hbsTemplate);
            html = template({ users });

            usersContainer.innerHTML = html;

        })
        .catch((err) => {
            console.log(`Hubo un error ${err}`)
        })

}

function deleteUser(id) {

    users = users.filter(u => u.id != id)
    renderUserList();

}

function renderProds(prods) {

    let html;

    fetch("../static/hbs/products.hbs")
        .then(response => response.text())
        .then(hbsTemplate => {

            const template = Handlebars.compile(hbsTemplate);
            html = template({ prods });

            prodContainer.innerHTML = html;

        })
        .catch((err) => {
            console.log(`Hubo un error ${err}`)
        })

}

function addProd() {

    user.socket.emit("newProd", { name: prodName.value, price: prodPrice.value, thumbnail: prodThumbnail.value });

    prodName.value = null;
    prodPrice.value = null;
    prodThumbnail.value = null;

}

function msgManager(e) {
    e.preventDefault();

    if (!msg.value) {
        return;
    }

    const message = {
        msg: msg.value,
        date: Date.now(),
        user: user.email
    }

    user.socket.emit("message", message);
    render(message);
    msg.value = null;

}

function render(data) {
    const msgElement = document.createElement("div")
    const userEl = `<p class="user">${data.user}</p>`
    const timeEl = `<p class="date-time">${new Date(data.date).toLocaleString()}</p> &nbsp;`
    const cssClass = data.user == user.email ? "local" : "remote"
    msgElement.classList.add(cssClass);
    msgElement.classList.add("msgBubble");
    msgElement.innerHTML = `
      <div class="message ${cssClass === "local" ? "align-right" : "align-left"}">
        ${cssClass === "local" ? userEl + timeEl : timeEl + userEl}
      </div>
      <div class="message-body">${data.msg}</div>
    `
    msgsContainer.appendChild(msgElement);
    msgsContainer.scrollTop = msgsContainer.scrollHeight
}


