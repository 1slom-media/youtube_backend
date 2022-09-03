import { read, write } from "../utils/model.js";
import { AuthorizationError, InternalServerError } from "../utils/errors.js";
import sha256 from "sha256";
import jwt from "../utils/jwt.js";
import path from "path";

export const GET= (req, res, next) => {
  try {
    let users = read("users").filter(user => delete user.password);

    let {userId} = req.params;

    if(userId){
      return res.status(200).send(users.find(user => user.userId == userId))
    }

    res.status(200).send(JSON.stringify(users));
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}

export const LOGIN = (req, res,next) => {
  try {
    let { username, password } = req.body;

    let users = read("users");

    let user = users.find(
      (user) => user.username == username && user.password == sha256(password)
    );

    let agent = req.headers["user-agent"];
    let ip = req.ip;

    if (!user) {
      return next(new AuthorizationError (401,"wrong username or password"))
    }
    
    return res.status(200).json({
      status: 200,
      message: "ok",
      data:user,
      token: jwt.sign({ userId: user.userId, agent: agent, ip: ip }),
    });

  } catch (error) {
    return next(new InternalServerError(500,error.message))
  }
};

export const REGISTER = (req, res,next) => {
  try {
    let { username, password} = req.body;

    let users = read("users");

    let fileName = Date.now() + req.files.image.name.replace(/\s/g, "");
    req.files.image.mv(path.join(process.cwd(), "src", "uploads", fileName));

    let newUser = {
      userId: users.at(-1)?.userId + 1 || 1,
      username,
      password: sha256(password),
      image:fileName,
    };

    users.push(newUser);
    write("users", users);

    let agent = req.headers["user-agent"];
    let ip = req.ip;
    delete newUser.password
    
    return res.status(201).json({
      status: 201,
      message: "ok",
      data:newUser,
      token: jwt.sign({ userId: newUser.userId, agent: agent, ip: ip }),
    });

  } catch (error) {
    return next(new InternalServerError(500,error.message))
  }
};
