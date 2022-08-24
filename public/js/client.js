const submitButton = document.getElementById("submit");
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const passwordInput = document.getElementById("password");
const usersContainer = document.getElementById("usersContainer");
const chat = document.getElementById("chat");
const msgsContainer = document.getElementById("msgsContainer");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");
const chaTitle = document.getElementById("chatTitle")

const user = {}
user.email = emailInput.innerHTML;

let users = [];

user.info = {
    email: user.email,
    name: nameInput.innerHTML,
    surname: surnameInput.innerHTML
}

user.socket = io();

user.socket.emit("userEmail", user.info);
user.socket.on("users", renderUser);
user.socket.on("messages", (data) => {

    const author = new normalizr.schema.Entity("authors", {}, { idAttribute: "email" });
    const message = new normalizr.schema.Entity("messages", {
        author: author
    });

    const messages = new normalizr.schema.Entity("data", {
        messages: [message]
    });

    const denormalizedData = normalizr.denormalize(data.result, messages, data.entities);

    for (const item of denormalizedData.messages) {
        renderPending(item._doc)
    };

    chaTitle.innerHTML = `Chat compression: ${compression(JSON.stringify(data).length, JSON.stringify(denormalizedData).length)}%`

})
user.socket.on("offline", deleteUser);
user.socket.on("message", render);

renderUserList();

sendBtn.addEventListener("click", msgManager);

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

function msgManager(e) {
    e.preventDefault();

    if (!msg.value) {
        return;
    }

    const message = {
        text: msg.value,
        date: Date.now(),
        author: user.info
    }

    user.socket.emit("message", message);
    render(message);
    msg.value = null;

}

function render(data) {
    const msgElement = document.createElement("div")
    const userEl = `<p class="user">${data.author.email}:</p>`
    const cssClass = data.author.email == user.email ? "local" : "remote"
    msgElement.classList.add(cssClass);
    msgElement.classList.add("msgBubble");
    msgElement.classList.add(cssClass === "local" ? "right" : "left")
    msgElement.innerHTML = `
      <div class="message">
        ${cssClass === "local" ? userEl : userEl}
      </div>
      <div class="message-body">${data.text}</div>
    `
    msgsContainer.appendChild(msgElement);
    msgsContainer.scrollTop = msgsContainer.scrollHeight
}

function renderPending(data) {

    const msgElement = document.createElement("div")
    const userEl = `<p class="user">${data.author.email}:</p>`
    const cssClass = data.author.email == user.email ? "local" : "remote"

    if (cssClass == "remote") {
        msgElement.classList.add(cssClass);
        msgElement.classList.add("msgBubble");
        msgElement.classList.add(cssClass === "local" ? "right" : "left")
        msgElement.innerHTML = `
              <div class="message">
                ${cssClass === "local" ? userEl : userEl}
              </div>
              <div class="message-body">${data.text}</div>
            `
        msgsContainer.appendChild(msgElement);
        msgsContainer.scrollTop = msgsContainer.scrollHeight
    }

}

function compression(normalized, denormalized) {

    return Math.floor(100 - ((denormalized * 100) / normalized));

}
