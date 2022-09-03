import jwt from "jsonwebtoken";

const secret = "maxfiy so`z";

export default {
    sign: payload => jwt.sign(payload, secret),
    verify: token => jwt.verify(token, secret)
}