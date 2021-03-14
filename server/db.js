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
