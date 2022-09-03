import { read,write } from "../utils/model.js"
import { InternalServerError,NotFoundError } from "../utils/errors.js"
import path from 'path'

export const GET =(req,res,next)=>{
    try {
       let videos=read("videos") ;
       let users=read("users");
       let {userId,search}=req.query

       if(req.url=="/admin/videos") userId=req.userId

        let data=videos=videos.filter(video=>{
        let bysearch=search ? video.title.toLowerCase().includes(search.toLowerCase()): true 
        let byuserId=userId ? video.userId==userId : true

        video.user=users.find(user=>user.userId==video.userId);
        delete video.userId;
        delete video.user.password;

        return bysearch && byuserId
       })

       res.send(data)
    } catch (error) {
        return next(new InternalServerError (500,error.message))
    }

}


export const POST=(req,res,next)=>{
    try {
        let videos=read("videos");
        let {title}=req.body;
        let users=read("users");
        const time=new Date()

        let{file}=req.files
        let fileName=file.name.replace(/\s/g,"")
        file.mv(path.join(process.cwd(), "src", "uploads", fileName));

        let newVideo={
            videoId:videos.length ? videos.at(-1)?.videoId +1:1,
            userId:req.userId,title,size:file.size,link:fileName,time:time.getFullYear() + "|" + time.getHours() + ":" + time.getMinutes(),
            type:file.mimetype,

        }

        videos.push(newVideo)
        write("videos",videos)

        newVideo.user=users.find(user=>user.userId==req.userId);
        delete newVideo.user.password
        delete newVideo.userId

        res.status(201).json({
            status:201,
            message:"video upload",
            data:newVideo
        })


    } catch (error) {
        return next(new InternalServerError (500,error.message))
    }

}

export const PUT=(req,res,next)=>{
    try {
        let videos=read("videos");
        let users=read("users");

        let video = videos.find(video=>video.videoId == req.params.videoId && video.userId==req.userId)

        if(!video){
            return next(new NotFoundError (404,"video not found"))
        }

        video.title=req.body.title || video.title

        write("videos",videos)

        video.user=users.find(user=>user.userId==req.userId);
        delete video.user.password
        delete video.userId

        res.status(202).json({
            status:202,
            message:"video title update",
            data:video
        })

    } catch (error) {
        return next(new InternalServerError (500,error.message))
    }

}

export const DELETE=(req,res,next)=>{
    try {
        let videos=read("videos");
        let users=read("users");

        let videoIndex = videos.findIndex(video=>video.videoId == req.params.videoId && video.userId==req.userId)

        if(videoIndex == -1){
            return next(new NotFoundError (404,"video not found"))
        }

        let catVideo=videos.splice(videoIndex,1)

        write("videos",videos)

        catVideo.user=users.find(user=>user.userId==req.userId);
        delete catVideo.user.password
        delete catVideo.userId

        res.status(202).json({
            status:204,
            message:"video deleted",
            data:catVideo
        })

    } catch (error) {
        return next(new InternalServerError (500,error.message))
    }

}