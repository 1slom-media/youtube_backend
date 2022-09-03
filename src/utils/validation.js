import Joi from "joi";

export const LoginSchema=Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required()
})

export const RegisterSchema=Joi.object({
    username:Joi.string().min(2).max(32).required(),
    password:Joi.string().min(8).required(),
    image:Joi.string().pattern(new RegExp (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i))
})

export const Video=Joi.object({
    title:Joi.string().required().min(2).max(40),
    file:Joi.string().pattern(new RegExp (/\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i)),
})

