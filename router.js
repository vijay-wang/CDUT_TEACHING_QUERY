const server=require("./server")
const http=require("http");
const querystring=require("querystring");
const  express=require("express");
const router=express.Router();


router.post("/login",server.login);

router.get("/index",server.query);

router.get("/scoreList",server.score)


router.get("/schedules",server.schedules);

router.get("/emptyClassRoom",server.emptyClassRoomQuery);
module.exports=router;