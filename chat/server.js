const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const usersFile = path.join(__dirname, "users.json");
const groupsFile = path.join(__dirname, "groups.json");

app.use(cors());
app.use(express.json());

function getUsers() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, "[]");
    }

    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

    let migrated = false;

    const normalizedUsers = users.map(user => {
        if (typeof user === "string") {
            migrated = true;
            return {
                userId: user,
                username: "AeroUser",
                secretKey: generateSecretKey(),
                addedContacts: [],
                messages: {}
            };
        }

        const messages = (typeof user.messages === "object" && user.messages !== null)
            ? user.messages
            : {};

        for (const contactId in messages) {
            if (Array.isArray(messages[contactId]) && messages[contactId].length > 20) {
                messages[contactId] = messages[contactId].slice(-20);
                migrated = true;
            }
        }

        let secretKey = user.secretKey;

        if (!secretKey) {
            secretKey = generateSecretKey();
            migrated = true;
        }

        return {
            userId: user.userId,
            username: typeof user.username === "string" && user.username.trim()
                ? user.username
                : "AeroUser",
            secretKey: secretKey,
            addedContacts: Array.isArray(user.addedContacts) ? user.addedContacts : [],
            messages: messages
        };
    });

    if (migrated) {
        saveUsers(normalizedUsers);
    }

    return normalizedUsers;
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getGroups() {
    if (!fs.existsSync(groupsFile)) {
        fs.writeFileSync(groupsFile, "[]");
    }

    return JSON.parse(fs.readFileSync(groupsFile, "utf8"));
}

function saveGroups(groups) {
    fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));
}

function generateUserId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 10; i++) {
        id += characters[crypto.randomInt(characters.length)];
    }
    return id;
}

function generateSecretKey() {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    
    for (let i = 0; i < 8; i++) {
        key += characters[crypto.randomInt(characters.length)];
    }
    
    return key;
}

function hasValidKey(user, req) {
    return user.secretKey === req.get("x-secret-key");
}

function findUser(users, userId) {
    return users.find(user => user.userId === userId);
}

function formatUserResponse(user, users) {
    const contactsWithDetails = user.addedContacts.map(cId => {
        const cUser = findUser(users, cId);
        return {
            userId: cId,
            username: cUser ? cUser.username : cId
        };
    });

    const groups = getGroups()
        .filter(group => group.members.includes(user.userId))
        .map(group => ({
            groupId: group.groupId,
            name: group.name,
            members: group.members.map(mId => {
                const mUser = findUser(users, mId);
                return {
                    userId: mId,
                    username: mUser ? mUser.username : mId
                };
            }),
            messages: group.messages
        }));

    return {
        userId: user.userId,
        username: user.username,
        secretKey: user.secretKey,
        addedContacts: user.addedContacts,
        contacts: contactsWithDetails,
        groups: groups,
        messages: user.messages
    };
}

// Create a user
app.post("/create-user", (req, res) => {
    const users = getUsers();
    let userId;

    do {
        userId = generateUserId();
    } while (users.some(user => user.userId === userId));

    const user = {
        userId,
        username: "AeroUser",
        secretKey: generateSecretKey(),
        addedContacts: [],
        messages: {}
    };

    users.push(user);
    saveUsers(users);

    res.status(201).json(formatUserResponse(user, users));
});

// Retrieve a user's information
app.get("/user/:userId", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    res.json(formatUserResponse(user, users));
});

// Change username
app.patch("/user/:userId/username", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";

    if (!username || username.length > 24) {
        return res.status(400).json({ error: "Username must be between 1 and 24 characters." });
    }

    user.username = username;
    saveUsers(users);

    res.json(formatUserResponse(user, users));
});

// Add a contact
app.post("/user/:userId/contacts", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "Your user account was not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    const contactId = typeof req.body.contactId === "string"
        ? req.body.contactId.trim().toUpperCase()
        : "";

    if (!contactId) {
        return res.status(400).json({ error: "Enter a contact User ID." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    if (contactId === user.userId) {
        return res.status(400).json({ error: "You cannot add yourself as a contact." });
    }

    const contact = findUser(users, contactId);

    if (!contact) {
        return res.status(404).json({ error: "No user exists with that ID." });
    }

    if (user.addedContacts.includes(contactId)) {
        return res.status(409).json({ error: "That contact is already added." });
    }

    user.addedContacts.push(contact.userId);
    if (!user.messages[contact.userId]) user.messages[contact.userId] = [];

    if (!contact.addedContacts.includes(user.userId)) {
        contact.addedContacts.push(user.userId);
    }
    if (!contact.messages[user.userId]) contact.messages[user.userId] = [];

    saveUsers(users);

    res.status(201).json(formatUserResponse(user, users));
});

// Send a message to a contact
app.post("/user/:userId/messages", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "Sender not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    const contactId = typeof req.body.contactId === "string" ? req.body.contactId.trim().toUpperCase() : "";
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!contactId || !text) {
        return res.status(400).json({ error: "Contact ID and text content are required." });
    }

    const contact = findUser(users, contactId);
    if (!contact) {
        return res.status(404).json({ error: "Recipient contact not found." });
    }

    const msgObj = {
        senderId: user.userId,
        senderName: user.username,
        text: text,
        timestamp: new Date().toISOString()
    };

    if (!user.messages[contactId]) user.messages[contactId] = [];
    if (!contact.messages[user.userId]) contact.messages[user.userId] = [];

    user.messages[contactId].push(msgObj);
    contact.messages[user.userId].push(msgObj);

    if (user.messages[contactId].length > 20) {
        user.messages[contactId] = user.messages[contactId].slice(-20);
    }
    if (contact.messages[user.userId].length > 20) {
        contact.messages[user.userId] = contact.messages[user.userId].slice(-20);
    }

    saveUsers(users);

    res.status(201).json({
        messages: user.messages[contactId]
    });
});

// Create a group chat
app.post("/user/:userId/groups", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const memberIds = Array.isArray(req.body.members) ? req.body.members : [];
    const members = memberIds.filter(id => user.addedContacts.includes(id));

    if (!name || name.length > 24) {
        return res.status(400).json({ error: "Group name must be between 1 and 24 characters." });
    }

    if (!members.length) {
        return res.status(400).json({ error: "Pick at least one of your contacts." });
    }

    const groups = getGroups();

    groups.push({
        groupId: generateUserId(),
        name: name,
        members: [user.userId, ...new Set(members)],
        messages: []
    });

    saveGroups(groups);

    res.status(201).json(formatUserResponse(user, users));
});

// Send a message to a group
app.post("/user/:userId/groups/:groupId/messages", (req, res) => {
    const users = getUsers();
    const user = findUser(users, req.params.userId);

    if (!user) {
        return res.status(404).json({ error: "Sender not found." });
    }

    if (!hasValidKey(user, req)) {
        return res.status(401).json({ error: "Invalid secret key." });
    }

    const groups = getGroups();
    const group = groups.find(g => g.groupId === req.params.groupId);

    if (!group || !group.members.includes(user.userId)) {
        return res.status(404).json({ error: "Group not found." });
    }

    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!text) {
        return res.status(400).json({ error: "Message text is required." });
    }

    group.messages.push({
        senderId: user.userId,
        senderName: user.username,
        text: text,
        timestamp: new Date().toISOString()
    });

    group.messages = group.messages.slice(-20);

    saveGroups(groups);

    res.status(201).json({ messages: group.messages });
});

app.get("/", (req, res) => {
    res.json({ status: "Aero Games chat backend is running!" });
});

app.listen(port, () => {
    console.log(`Aero Games server running on port ${port}`);
});