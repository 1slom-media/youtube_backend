import { Router } from "express";
import checkToken from "../middlewares/checkToken.js";
import validation from "../middlewares/validation.js";
import { GET,POST,PUT,DELETE } from "../controllers/video.cantroller.js";

const router=Router()

router.get('/videos',GET);
router.get('/admin/videos',checkToken,GET)
router.post('/admin/videos',checkToken,validation,POST)
router.put('/admin/videos/:videoId',checkToken,PUT)
router.delete('/admin/videos/:videoId',checkToken,DELETE)

export default router;