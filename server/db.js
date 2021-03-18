const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addUser = (first, last, email, hashpass) => {
    const q = `
        INSERT INTO users (first, last, email, hashpass) 
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first, last, email, hashpass];
    return db.query(q, params);
};

module.exports.getUserByEmail = (email) => {
    const q = `
    SELECT *
    FROM users
    WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params);
};

// have to update with imgUrl in table
module.exports.getUserById = (id) => {
    const q = `
    SELECT first, last, imgurl, bio
    FROM users
    WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addCode = (email, dcode) => {
    const q = `
        INSERT INTO resetcodes (user_email, dcode)
        VALUES ($1, $2)
        RETURNING id
    `;
    const params = [email, dcode];
    return db.query(q, params);
};

module.exports.getCode = (email) => {
    const q = `
    SELECT *
    FROM resetcodes
    WHERE user_email = $1
    ORDER BY id DESC
    LIMIT 1
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePass = (hashedpass, email) => {
    const q = `
    UPDATE users
    SET hashpass = $1
    WHERE email = $2
    `;
    const params = [hashedpass, email];
    return db.query(q, params);
};

module.exports.updateImg = (imgUrl, userId) => {
    const q = `
    UPDATE users
    SET imgurl = $1
    WHERE id = $2
    `;
    const params = [imgUrl, userId];
    return db.query(q, params);
};

module.exports.updateBio = (bio, userId) => {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    `;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.getRecentUsers = () => {
    const q = `
    SELECT *
    FROM users
    ORDER BY id DESC
    LIMIT 5
    `;
    return db.query(q);
};

module.exports.getSearchUsers = (searchTerm) => {
    const q = `
    SELECT *
    FROM users
    WHERE first ILIKE $1 OR last ILIKE $1
    LIMIT 5
    `;
    const params = [searchTerm + "%"];
    return db.query(q, params);
};

module.exports.getFriendship = (userId, otherId) => {
    const q = `
    SELECT *
    FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1);
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.addFriend = (userId, otherId, accepted) => {
    const q = `
    INSERT INTO friendships (sender_id, recipient_id, accepted)
    VALUES ($1,$2,$3)
    `;
    const params = [userId, otherId, accepted];
    return db.query(q, params);
};

module.exports.cancelRequest = (userId, otherId) => {
    const q = `
    DELETE FROM friendships
    WHERE sender_id = $1 AND recipient_id = $2
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.acceptRequest = (userId, otherId, accepted) => {
    const q = `
    UPDATE friendships
    SET accepted = $3
    WHERE sender_id = $2 AND recipient_id = $1
    `;
    const params = [userId, otherId, accepted];
    return db.query(q, params);
};

module.exports.removeFriend = (userId, otherId) => {
    const q = `
    DELETE FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1); 
    `;
    const params = [userId, otherId];
    return db.query(q, params);
};

// INCOMPLETE new query for reject request
module.exports.rejectRequest = (userId, otherId) => {};

module.exports.getFriendsWannabes = (userId) => {
    const q = `
    SELECT users.id, first, last, imgurl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id  = users.id)
    `;
    // returns users that are friends + users who sent requests to me
    // does not include users to whom requests have been sent by me

    // for pending requests sent by me:
    // OR (accepted = false AND sender_id = $1 AND recipient_id  = users.id)

    const params = [userId];
    return db.query(q, params);
};
