// Variables
const music = document.getElementById("music");
const clickSfx = new Audio('assets/sfx/click.wav');
let activeContactId = null;
let currentUserData = null;
let chatPollInterval = null;

// Generic
function start() {
    swapPage('menu');
    shuffleSong();
    music.addEventListener('ended', shuffleSong);
}

// Visuals
const bubbleContainer = document.getElementById("bubbles");

function spawnBubble() {
    const b = document.createElement("div");
    b.className = "bubble";

    const size = Math.random() * 25 + 10;
    b.style.width = size + "px";
    b.style.height = size + "px";

    b.style.left = Math.random() * 100 + "vw";

    const duration = Math.random() * 6 + 4;
    b.style.animationDuration = duration + "s";

    bubbleContainer.appendChild(b);

    setTimeout(() => b.remove(), duration * 750);
}

setInterval(spawnBubble, 300);

// Music
let songs = [
    "aquatic-ambience.mp3",
    "wii-party.mp3",
    "wii-u-mii-maker.mp3",
    "frutiger-aero.mp3",
    "lease.mp3",
    "lotus-waters.mp3",
    "wii-menu.mp3",
    "new-you.mp3"
];

let songnames = [
    "Aquatic Ambience",
    "Wii Party Theme",
    "Wii U Mii Maker Theme",
    "Frutiger Aero",
    "LEASE",
    "Lotus Waters",
    "Wii Menu Theme",
    "New You"
];

let currentIndex = -1;

function allowMusic(value) {
    if (!settings.music) {
        music.pause();
        return;
    }

    if (value) {
        shuffleSong();
    } else {
        music.pause();
    }
}

function shuffleSong() {
    if (!settings.music) return;

    const musicsource = document.getElementById("musicsource");

    let index;

    do {
        index = Math.floor(Math.random() * songs.length);
    } while (index === currentIndex && songs.length > 1);

    currentIndex = index;

    musicsource.src = "assets/songs/" + songs[index];

    music.load();
    music.play();

    announceSong(songnames[index]);
}

function announceSong(songname) {
    const nowplaying = document.getElementById("nowplaying");
    const songText = nowplaying.querySelector("h2");

    songText.textContent = "Now Playing: " + songname;

    nowplaying.classList.add("show");

    setTimeout(() => {
        nowplaying.classList.remove("show");
    }, 5000);
}

// Games / Apps
/*const games = [
    { name: "FNAF 1", img: "assets/sprites/games/fnaf1.jpg", url: "assets/games/clFNAF.html" },
    { name: "FNAF 2", img: "assets/sprites/games/fnaf2.jpg", url: "assets/games/clFNAF2.html" },
    { name: "FNAF 3", img: "assets/sprites/games/fnaf3.webp", url: "assets/games/clFNAF3.html" },
    { name: "FNAF 4", img: "assets/sprites/games/fnaf4.jpg", url: "assets/games/clFNAF4.html" },
    { name: "FNAF SL", img: "assets/sprites/games/fnafsl.jpg", url: "assets/games/clfnafsl.html" },
    { name: "FNAF PS", img: "assets/sprites/games/fnafps.webp", url: "assets/games/clfnafps.html" },
    { name: "FNAF UCN", img: "assets/sprites/games/fnafucn.webp", url: "assets/games/clfnafucn.html" },
    { name: "Five Nights at Epstein's", img: "assets/sprites/games/fnae.png", url: "assets/games/clfivenightsatepsteins.html" },
    { name: "One Night at Kim Jong Un's", img: "assets/sprites/games/onakju.png", url: "assets/games/onakju/One-Night-At-Kim-Jong-Un-s-Webport-main/index.html" },
    { name: "Granny", img: "assets/sprites/games/granny.png", url: "assets/games/granny/granny-main/index.html" },
    { name: "Geometry Dash", img: "assets/sprites/games/geometrydash.png", url: "assets/games/clgdlite.html" },
    { name: "Just Shapes & Beats", img: "assets/sprites/games/jsab.jpg", url: "assets/games/jsab/jsab-main/index.html" },
    { name: "Space Waves", img: "assets/sprites/games/spacewaves.webp", url: "assets/games/clspacewaves.html" },
    { name: "Cookie Clicker", img: "assets/sprites/games/cookieclicker.jpg", url: "assets/games/clcookieclicker.html" },
    { name: "Brotato", img: "assets/sprites/games/brotato.webp", url: "assets/games/clbrotato.html" },
    { name: "Raft", img: "assets/sprites/games/raft.jpg", url: "assets/games/raft/index.html" },
    { name: "Ages of Conflict", img: "assets/sprites/games/agesofconflict.webp", url: "assets/games/clagesofconflict.html" },
    { name: "Bad Time Simulator", img: "assets/sprites/games/badtimesim.webp", url: "assets/games/clbadtimesim.html" },
    { name: "Undertale Yellow", img: "assets/sprites/games/undertaleyellow.jpg", url: "assets/games/clundertaleyellow.html" },
    { name: "Deltarune", img: "assets/sprites/games/deltarune.webp", url: "assets/games/cldeltarune.html" },
    { name: "Gorilla Tag", img: "assets/sprites/games/gtag.webp", url: "assets/games/clgorillatag.html" },
    { name: "Basket Random", img: "assets/sprites/games/basketrandom.webp", url: "assets/games/clbasketrandom.html" },
    { name: "Soccer Random", img: "assets/sprites/games/soccerrandom.png", url: "assets/games/clsoccerrandom.html" },
    { name: "Boxing Random", img: "assets/sprites/games/boxingrandom.webp", url: "assets/games/clboxingrandom.html" },
    { name: "Minecraft", img: "assets/sprites/games/minecraft.webp", url: "assets/games/clastra.html" },
    { name: "Polytrack", img: "assets/sprites/games/polytrack.png", url: "assets/games/clpolytrackworksnow.html" },
    { name: "Stick With It", img: "assets/sprites/games/stickwithit.jpg", url: "assets/games/stickwithit/StickWithItPort-main/index.html" },
    { name: "SMB Remastered", img: "assets/sprites/games/smbremastered.webp", url: "assets/games/clsmbremastered.html" },
    { name: "Bitlife", img: "assets/sprites/games/bitlife.png", url: "assets/games/clbitlife.html" },
    { name: "Baldi's Basics", img: "assets/sprites/games/baldis.png", url: "assets/games/clbaldisbasics.html" },
    { name: "Bloxorz", img: "assets/sprites/games/bloxorz.png", url: "assets/games/clbloxorz.html" },
    { name: "OvO", img: "assets/sprites/games/ovo.png", url: "assets/games/clovofixed.html" },
    { name: "Buckshot Roulette", img: "assets/sprites/games/buckshotroulette.jpg", url: "assets/games/Buckshot Roulette.html" },
];

const apps = [
    { name: "Emulator JS", img: "assets/sprites/apps/emulatorjs.webp", url: "assets/apps/emujs.html" },
    { name: "Soundboard", img: "assets/sprites/apps/soundboard.webp", url: "assets/apps/soundboard.html" },
    { name: "Tev", img: "assets/sprites/apps/tev.png", url: "assets/apps/tev.html" },
    { name: "Foxsoundi", img: "assets/sprites/apps/foxsoundi.png", url: "assets/apps/foxsoundi.html" },
];

function createGameButtons() {
    const container = document.querySelector("#games .content-panel");
    container.innerHTML = "";

    games.forEach(game => {
        const btn = document.createElement("button");
        btn.className = "gamebutton";

        btn.onclick = () => {
            allowMusic(false);
            openGame(game.url);
        };

        btn.innerHTML = `
            <div class="icon-wrapper">
                <img class="gameicon" src="${game.img}" alt="${game.name}">
            </div>
        `;

        btn.addEventListener("mouseenter", () => {
            showHoverName(btn, game.name);
        });

        btn.addEventListener("mouseleave", hideHoverName);

        container.appendChild(btn);
    });
}

function createAppButtons() {
    const container = document.querySelector("#apps .content-panel");
    container.innerHTML = "";

    apps.forEach(app => {
        const btn = document.createElement("button");
        btn.className = "gamebutton";

        btn.onclick = () => {
            allowMusic(false);
            openGame(app.url);
        };

        btn.innerHTML = `
            <div class="icon-wrapper">
                <img class="gameicon" src="${app.img}" alt="${app.name}">
            </div>
        `;

        btn.addEventListener("mouseenter", () => {
            showHoverName(btn, app.name);
        });

        btn.addEventListener("mouseleave", hideHoverName);

        container.appendChild(btn);
    });
}

function closeView() {
    const gameframe = document.getElementById("gameappframe");

    gameframe.src = "";

    allowMusic(true);
    swapPage('menu');
}

function openGame(gamesrc) {
    const frame = document.getElementById("gameappframe");

    frame.src = gamesrc;

    allowMusic(false);
    swapPage('view');
}

function toggleFullscreen(framename) {
    const frame = document.getElementById(framename);

    if (!document.fullscreenElement) {
        frame.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function openInAboutBlank() {
    const frame = document.getElementById("gameappframe");
    const newTab = window.open("about:blank", "_blank");

    if (!newTab) {
        alert("Please allow pop-ups for Aero Games.");
        return;
    }

    newTab.document.body.style.margin = "0";
    newTab.document.body.style.overflow = "hidden";

    const iframe = newTab.document.createElement("iframe");

    iframe.src = frame.src;
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "0";

    newTab.document.body.appendChild(iframe);
}

const hovername = document.getElementById("hovername");

function showHoverName(button, name) {
    const rect = button.getBoundingClientRect();

    hovername.textContent = name;
    hovername.style.left = rect.left + rect.width / 2 + "px";
    hovername.style.top = rect.bottom + 12 + "px";

    hovername.classList.add("show");
}

function hideHoverName() {
    hovername.classList.remove("show");
}*/

// Pages
function swapPage(newPageId) {
    const currentPage = document.querySelector('.page.active');
    const newPage = document.getElementById(newPageId);

    if (currentPage === newPage) return;

    if (currentPage) {
        currentPage.classList.add('exit');
        currentPage.classList.remove('active');
    }

    setTimeout(() => {
        if (currentPage) currentPage.classList.remove('exit');

        newPage.classList.add('active');
    }, 400);
}

// Chat
const chatApiBase = "https://render-styles-stack-signatures.trycloudflare.com";
let activeGroupId = null;

function showChatStatus(message, isError = false) {
    const status = document.getElementById("chatstatus");

    if (!status) return;

    status.textContent = message;
    status.dataset.error = isError ? "true" : "false";
}

function showChatMenu() {
    document.getElementById("chatsignup").style.display = "none";
    document.getElementById("chatmenu").style.display = "grid";
    startChatPolling();
}

function startChatPolling() {
    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(async () => {
        const userId = localStorage.getItem("aeroUserId");
        if (userId) {
            await refreshChatUser(true);
        } else {
            stopChatPolling();
        }
    }, 3000);
}

function stopChatPolling() {
    if (chatPollInterval) {
        clearInterval(chatPollInterval);
        chatPollInterval = null;
    }
}

async function registerUser() {
    const button = document.getElementById("chatregister");

    button.disabled = true;
    showChatStatus("");

    try {
        const response = await fetch(
            `${chatApiBase}/create-user`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not create your account."
            );
        }

        localStorage.setItem("aeroUserId", data.userId);
        localStorage.setItem("aeroSecretKey", data.secretKey);

        showChatMenu();

        await refreshChatUser();

        showChatStatus("Chat account created. Store your Secret Key somewhere safe, you'll need it to log in!");
    } catch (error) {
        showChatStatus(
            error.message || "Could not connect to the chat server.",
            true
        );
    } finally {
        button.disabled = false;
    }
}

async function loginUser() {
    const button = document.getElementById("chatlogin");
    const userId = document.getElementById("chatloginid").value.trim().toUpperCase();
    const secretKey = document.getElementById("chatloginkey").value.trim();

    button.disabled = true;
    showChatStatus("");

    try {
        if (!userId || !secretKey) {
            throw new Error("Please enter your User ID and Secret Key.");
        }

        const response = await fetch(
            `${chatApiBase}/user/${encodeURIComponent(userId)}`,
            { headers: { "x-secret-key": secretKey } }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not find an account with that ID."
            );
        }

        localStorage.setItem("aeroUserId", data.userId);
        localStorage.setItem("aeroSecretKey", secretKey);
        document.getElementById("chatloginkey").value = "";

        showChatMenu();

        await refreshChatUser();

        showChatStatus("Logged in successfully.");
    } catch (error) {
        showChatStatus(
            error.message || "Could not connect to the chat server.",
            true
        );
    } finally {
        button.disabled = false;
    }
}

function logoutUser() {
    localStorage.removeItem("aeroUserId");
    localStorage.removeItem("aeroSecretKey");
    keyVisible = false;
    document.getElementById("chatloginkey").value = "";

    stopChatPolling();

    activeContactId = null;
    activeGroupId = null;

    const members = document.getElementById("chatgroupmembers");
    members.replaceChildren();
    delete members.dataset.key;

    currentUserData = null;

    document.getElementById("chatmenu").style.display = "none";
    document.getElementById("chatsignup").style.display = "block";

    document.getElementById("chatuserid").textContent = "Not logged in";
    document.getElementById("chatcontactsmenu").innerHTML = "";
    document.getElementById("chatmessagehistory").innerHTML = "";
    document.getElementById("activechatheader").textContent = "Select a contact to view messages";
    document.getElementById("chatinputarea").style.display = "none";

    const loginInput = document.getElementById("chatloginid");
    if (loginInput) {
        loginInput.value = "";
    }

    if (typeof showChatStatus === "function") {
        showChatStatus("");
    }
}

async function refreshChatUser(isPolling = false) {
    const userId = localStorage.getItem("aeroUserId");

    if (!userId) return;

    try {
        const response = await fetch(
            `${chatApiBase}/user/${encodeURIComponent(userId)}`,
            { headers: authHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404 || response.status === 401) {
                localStorage.removeItem("aeroUserId");
                stopChatPolling();

                document.getElementById("chatsignup").style.display = "block";
                document.getElementById("chatmenu").style.display = "none";
            }

            throw new Error(
                data.error || "Could not load your chat account."
            );
        }

        currentUserData = data;
        renderSecretKey();
        if (!isPolling) {
            showChatMenu();
        }

        document.getElementById("chatuserid").textContent =
            "Your User ID: " + data.userId;

        const usernameInput = document.getElementById("chatusernameinput");
        if (document.activeElement !== usernameInput) {
            usernameInput.value = data.username || "";
        }

        renderContacts(data.contacts || []);
        renderGroupMembers(data.contacts);

        if (activeContactId && data.addedContacts.includes(activeContactId)) {
            renderMessages(activeContactId);
        }

        if (activeGroupId) {
            renderGroupMessages(activeGroupId);
        }

        return data;
    } catch (error) {
        if (!isPolling) {
            showChatStatus(
                error.message || "Could not connect to the chat server.",
                true
            );
        }

        return null;
    }
}

function loadUser() {
    const userId = localStorage.getItem("aeroUserId");

    if (userId) {
        showChatMenu();

        document.getElementById("chatuserid").textContent =
            "Your User ID: " + userId;

        refreshChatUser();
    } else {
        document.getElementById("chatsignup").style.display = "block";
        document.getElementById("chatmenu").style.display = "none";
    }
}

async function changeUsername() {
    const userId = localStorage.getItem("aeroUserId");

    const input = document.getElementById("chatusernameinput");
    const username = input.value.trim();

    if (!userId) {
        showChatStatus("Register for chat first.", true);
        return;
    }

    if (!username || username.length > 24) {
        showChatStatus(
            "Username must be between 1 and 24 characters.",
            true
        );
        return;
    }

    try {
        const response = await fetch(
            `${chatApiBase}/user/${encodeURIComponent(userId)}/username`,
            {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({
                    username: username
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not change username."
            );
        }

        input.value = data.username;
        currentUserData = data;
        renderContacts(data.contacts || []);

        showChatStatus("Username changed.");
    } catch (error) {
        showChatStatus(
            error.message || "Could not connect to the chat server.",
            true
        );
    }
}

let keyVisible = false;

function authHeaders(extra = {}) {
    return { "x-secret-key": localStorage.getItem("aeroSecretKey") || "", ...extra };
}

function renderSecretKey() {
    const btn = document.getElementById("chatsecretkey");
    btn.textContent = keyVisible ? currentUserData.secretKey : "••••••••";
}

function toggleSecretKey() {
    keyVisible = !keyVisible;
    renderSecretKey();
}

async function addContact() {
    const userId = localStorage.getItem("aeroUserId");

    const input = document.getElementById("chatcontactinput");
    const contactId = input.value.trim().toUpperCase();

    if (!userId) {
        showChatStatus("Register for chat first.", true);
        return;
    }

    if (!contactId) {
        showChatStatus("Enter the contact's User ID.", true);
        return;
    }

    try {
        const response = await fetch(
            `${chatApiBase}/user/${encodeURIComponent(userId)}/contacts`,
            {
                method: "POST",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({
                    contactId: contactId
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not add contact."
            );
        }

        input.value = "";

        await refreshChatUser();

        showChatStatus("Contact added.");
    } catch (error) {
        showChatStatus(
            error.message || "Could not connect to the chat server.",
            true
        );
    }
}

function renderContacts(contacts) {
    const container = document.getElementById("chatcontactsmenu");
    const groups = currentUserData.groups;

    container.replaceChildren();

    if (!contacts.length && !groups.length) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No contacts added yet.";
        container.appendChild(emptyMessage);
        return;
    }

    groups.forEach(group => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chat-contact-btn";
        btn.textContent = "👥 " + group.name;

        if (group.groupId === activeGroupId) {
            btn.classList.add("active");
        }

        btn.onclick = () => selectGroup(group.groupId);

        container.appendChild(btn);
    });

    contacts.forEach(contact => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chat-contact-btn";
        btn.textContent = contact.username || contact.userId;

        if (contact.userId === activeContactId) {
            btn.classList.add("active");
        }

        btn.onclick = () => selectContact(contact.userId);

        container.appendChild(btn);
    });
}

function selectContact(contactId) {
    activeContactId = contactId;
    activeGroupId = null;

    renderContacts(currentUserData.contacts);
    renderMessages(contactId);
}

function selectGroup(groupId) {
    activeGroupId = groupId;
    activeContactId = null;

    renderContacts(currentUserData.contacts);
    renderGroupMessages(groupId);
}

function renderMessages(contactId) {
    const header = document.getElementById("activechatheader");
    const inputArea = document.getElementById("chatinputarea");

    const contactObj = currentUserData.contacts.find(c => c.userId === contactId);
    const contactName = contactObj ? contactObj.username : contactId;

    header.textContent = "Chatting with: " + contactName;
    inputArea.style.display = "flex";

    drawMessages(currentUserData.messages[contactId] || [], contactObj);
}

function renderGroupMessages(groupId) {
    const header = document.getElementById("activechatheader");
    const inputArea = document.getElementById("chatinputarea");

    const group = currentUserData.groups.find(g => g.groupId === groupId);
    const names = group.members.map(m => m.username).join(", ");

    header.textContent = group.name + " (" + names + ")";
    inputArea.style.display = "flex";

    drawMessages(group.messages, null);
}

function renderGroupMembers(contacts) {
    const container = document.getElementById("chatgroupmembers");
    const key = contacts.map(c => c.userId + c.username).join();

    if (container.dataset.key === key) return;

    const checked = [...container.querySelectorAll("input:checked")].map(box => box.value);

    container.dataset.key = key;
    container.replaceChildren();

    contacts.forEach(contact => {
        const label = document.createElement("label");
        const box = document.createElement("input");

        box.type = "checkbox";
        box.value = contact.userId;
        box.checked = checked.includes(contact.userId);

        label.append(box, " " + contact.username);
        container.appendChild(label);
    });
}

async function createGroup() {
    const userId = localStorage.getItem("aeroUserId");
    const nameInput = document.getElementById("chatgroupnameinput");
    const name = nameInput.value.trim();
    const boxes = document.querySelectorAll("#chatgroupmembers input:checked");
    const members = [...boxes].map(box => box.value);

    if (!name) {
        showChatStatus("Enter a group name.", true);
        return;
    }

    if (!members.length) {
        showChatStatus("Pick at least one contact for the group.", true);
        return;
    }

    try {
        const response = await fetch(
            `${chatApiBase}/user/${encodeURIComponent(userId)}/groups`,
            {
                method: "POST",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ name: name, members: members })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not create group.");
        }

        nameInput.value = "";
        boxes.forEach(box => box.checked = false);

        await refreshChatUser(true);

        showChatStatus("Group created.");
    } catch (error) {
        showChatStatus(
            error.message || "Could not connect to the chat server.",
            true
        );
    }
}

function drawMessages(messages, contactObj) {
    const history = document.getElementById("chatmessagehistory");

    history.replaceChildren();

    if (!messages.length) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No message history. Send a message to start!";
        emptyMsg.style.gridColumn = "1 / -1";
        emptyMsg.style.textAlign = "center";
        history.appendChild(emptyMsg);
        return;
    }

    messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-message-bubble";

        const isSelf = msg.senderId === currentUserData.userId;
        if (isSelf) {
            msgDiv.classList.add("self");
        }

        let displayName = msg.senderName;
        if (!displayName) {
            if (isSelf) {
                displayName = currentUserData.username;
            } else if (contactObj) {
                displayName = contactObj.username;
            } else {
                displayName = msg.senderId;
            }
        }

        msgDiv.innerHTML = `<span class="msg-sender">${escapeHtml(displayName)}</span><span class="msg-text">${escapeHtml(msg.text)}</span>`;
        history.appendChild(msgDiv);
    });

    history.scrollTop = history.scrollHeight;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function sendMessage() {
    const userId = localStorage.getItem("aeroUserId");
    const input = document.getElementById("chatmessageinput");
    const text = input.value.trim();

    if (!userId || !text || (!activeContactId && !activeGroupId)) return;

    const base = `${chatApiBase}/user/${encodeURIComponent(userId)}`;
    const url = activeGroupId
        ? `${base}/groups/${activeGroupId}/messages`
        : `${base}/messages`;
    const body = activeGroupId
        ? { text: text }
        : { contactId: activeContactId, text: text };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not send message.");
        }

        input.value = "";
        await refreshChatUser(true);
    } catch (error) {
        showChatStatus(error.message || "Failed to send message.", true);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Aero-Games/sw.js', { scope: '/Aero-Games/' })
            .then(reg => console.log('Service Worker registered successfully'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function toggleNotifications() {
    const checkbox = document.getElementById("notiftoggle");
    const userId = localStorage.getItem("aeroUserId");

    if (!userId) {
        alert("Log in to chat first.");
        checkbox.checked = false;
        return;
    }

    if (checkbox.checked) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("Notification permission denied.");
            checkbox.checked = false;
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const publicVapidKey = "YOUR_PUBLIC_VAPID_KEY"; // Must match backend VAPID public key
            
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await fetch(`${chatApiBase}/user/${encodeURIComponent(userId)}/subscribe`, {
                method: "POST",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ subscription })
            });

            showChatStatus("Notifications enabled!");
        } catch (error) {
            console.error("Failed to subscribe to notifications:", error);
            checkbox.checked = false;
        }
    } else {
        showChatStatus("Notifications disabled.");
    }
}

// Settings
const settings = {
    theme: "aqua",
    music: true,
    sfx: true
};

const rootStyles = getComputedStyle(document.documentElement);

let background = rootStyles.getPropertyValue('--background').trim();
let panel = rootStyles.getPropertyValue('--panel').trim();
let button = rootStyles.getPropertyValue('--button').trim();
let title = rootStyles.getPropertyValue('--title').trim();
let text = rootStyles.getPropertyValue('--text').trim();
let stroke = rootStyles.getPropertyValue('--stroke').trim();

function setTheme() {
    const selected = document.getElementById("themeselector").value;
    swapTheme(selected);
}

function swapTheme(theme) {
    settings.theme = theme

    if (theme === "aqua") {
        background = "linear-gradient(to top left, rgb(0, 89, 255), rgb(45, 160, 255))";
        panel = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(0,200,255,0.65) 40%, rgba(0,150,255,0.7) 100%)";
        button = panel;
        title = "linear-gradient(to bottom, #ffffff 0%, #bdf6ff 40%, #00c8ff 60%, #008cff 100%)";
        text = "rgb(0, 165, 255)";
        stroke = "rgb(0, 125, 255)";
    } else if (theme === "eco") {
        background = "linear-gradient(to top left, rgb(34,147,0), rgb(0,226,8))";
        panel = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(18,175,0,0.65) 40%, rgba(68,255,0,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(0,200,0,0.65) 40%, rgba(0,255,0,0.7) 100%)";
        title = "linear-gradient(to bottom, #ffffff 0%, #cfffbd 40%, #24c600 60%, #59ff00 100%)";
        text = "rgb(0, 255, 0)";
        stroke = "rgb(0, 150, 0)";
    } else if (theme == "dorfic") {
        background = "linear-gradient(to top left, rgb(255, 75, 0), rgb(255,125,0))";
        panel = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255, 100, 0, 0.65) 40%, rgba(255,125,0,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255, 75, 0, 0.65) 40%, rgba(255,150,0,0.7) 100%)";
        title = "linear-gradient(to bottom, #ffffff 0%, #cfffbd 40%, #ff7300 60%, #ff5e00 100%)";
        text = "rgb(255, 150, 0)";
        stroke = "rgb(255, 50, 0)";
    } else if (theme == "dark") {
        background = "linear-gradient(to top left, rgb(15, 15, 15), rgb(35, 35, 35)";
        panel = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(35, 35, 35, 0.65) 40%, rgba(15,15,15,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(25, 25, 25, 0.65) 40%, rgba(5,5,5,0.7) 100%)";
        title = "linear-gradient(to bottom, #ffffff 0%, #cfffbd 40%, #161616 60%, #000000 100%)";
        text = "rgb(20, 20, 20)";
        stroke = "rgb(0, 0, 0)";
    } else if (theme == "alba") {
        background = "linear-gradient(to top left, rgb(200, 200, 200), rgb(255, 255, 255)";
        panel = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(185, 185, 185, 0.65) 40%, rgba(165,165,165,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(155, 155, 155, 0.65) 40%, rgba(135,135,135,0.7) 100%)";
        title = "linear-gradient(to bottom, rgb(255,255,255) 0%, rgb(220, 220, 220) 40%, rgb(200, 200, 200) 60%, rgb(190, 190, 190) 100%)";
        text = "rgb(185, 185, 185)";
        stroke = "rgb(150, 150, 150)";
    } else if (theme == "clean") {
        background = "linear-gradient(to top left, rgb(85, 225, 200), rgb(100, 235, 255)";
        panel = "linear-gradient(to bottom, rgba(0, 255, 255, 0.4) 0%, rgba(0, 255, 175, 0.65) 40%, rgba(0,225,150,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(0,255,255,0.4) 0%, rgba(0, 255, 175, 0.65) 40%, rgba(0,225,150,0.7) 100%)";
        title = "linear-gradient(to bottom, rgb(50,255,255) 0%, rgb(0, 235, 255) 40%, rgb(0, 220, 255) 60%, rgb(0, 200, 255) 100%)";
        text = "rgb(0, 235, 255)";
        stroke = "rgb(0, 175, 255)";
    } else if (theme == "evil") {
        background = "linear-gradient(to top left, rgb(150, 0, 0), rgb(255, 0, 0)";
        panel = "linear-gradient(to bottom, rgba(255, 0, 0, 0.4) 0%, rgba(215, 0, 0, 0.65) 40%, rgba(175,0,0,0.71) 100%)";
        button = "linear-gradient(to bottom, rgba(255,0,0,0.4) 0%, rgba(225, 0, 0, 0.65) 40%, rgba(200,0,0,0.7) 100%)";
        title = "linear-gradient(to bottom, rgb(225,0,0) 0%, rgb(225, 0, 0) 40%, rgb(195, 0, 0) 60%, rgb(165, 0, 0) 100%)";
        text = "rgb(185, 0, 0)";
        stroke = "rgb(125, 0, 0)";
    }

    document.documentElement.style.setProperty('--background', background);
    document.documentElement.style.setProperty('--panel', panel);
    document.documentElement.style.setProperty('--button', button);
    document.documentElement.style.setProperty('--title', title);
    document.documentElement.style.setProperty('--text', text);
    document.documentElement.style.setProperty('--stroke', stroke);

    saveSettings();
}

function setMusic(enabled) {
    settings.music = enabled;

    if (!enabled) {
        music.pause();
    } else {
        shuffleSong();
    }

    saveSettings();
}

function toggleMusic() {
    const enabled = document.getElementById("musictoggle").checked;
    setMusic(enabled);
}

function setSfx(enabled) {
    settings.sfx = enabled;
    saveSettings();
}

function toggleSfx() {
    const enabled = document.getElementById("sfxtoggle").checked;
    setSfx(enabled);
}

function loadSettings() {
    const saved = localStorage.getItem("settings");

    if (saved) {
        Object.assign(settings, JSON.parse(saved));
    }

    swapTheme(settings.theme);

    if (!settings.music) {
        music.pause();
    }

    const selector = document.getElementById("themeselector");
    if (selector) {
        selector.value = settings.theme;
    }

    const toggle = document.getElementById("musictoggle");
    if (toggle) {
        toggle.checked = settings.music;
    }

    const sfxtoggle = document.getElementById("sfxtoggle");
    if (sfxtoggle) {
        sfxtoggle.checked = settings.sfx;
    }

    const uselesstoggle = document.getElementById("uselesstoggle");
    if (uselesstoggle) {
        uselesstoggle.checked = settings.uselesspages;
    }
}

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

// Calls
document.addEventListener("DOMContentLoaded", () => {
    createGameButtons();
    createAppButtons();
    loadSettings();
    loadUser();
});

window.addEventListener("load", () => {
    start();
});

document.addEventListener('click', () => {
    if (!settings.sfx) return;

    const sfx = new Audio('assets/sfx/click.wav');
    sfx.play();
});

window.onbeforeunload = function(e) {
    return 'You are about to leave Aero Games (possibly from GoGuardian). Do you wanna?';
};
