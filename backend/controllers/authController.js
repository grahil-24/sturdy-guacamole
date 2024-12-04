const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtUtil");

const users = [
    { id: 1, name: "user", email: "user@gmail.com", password: bcrypt.hashSync("12345", 10) },
];

const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && bcrypt.compareSync(password, u.password));

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken({ id: user.id, name: user.name });
    const refreshToken = generateRefreshToken({ id: user.id, name: user.name });
    console.log(accessToken);
    console.log(refreshToken);
    //refresh token stays valid for 7 days
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });


    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
};

//checking if user session is valid by checking the validity of refreshtoken. if refreshtoken is valid
//generate new accesstoken and send it with user details to client
const me = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = generateAccessToken({ id: user.id, name: user.name });

        res.json({
            user: { id: user.id, name: user.name },
            accessToken: newAccessToken
        });
    });
};
module.exports = { login, me };
