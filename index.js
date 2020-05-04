const http=require("http");
const express=require("express");
const bodyParser=require("body-parser");
const router=require("./router");
const app=express();
const template=require("art-template");



//启用静态资源服务
app.use("/public",express.static("public"));
//设置模板引擎路径
app.set("views","./views");
//设置模板引擎类型
app.set("view engine","art");
//兼容express
app.engine("art",require("express-art-template"));
//前端请求数据req.body解析
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//跨域访问解决
app.use(require('cors')());

app.use(router);
//监听3000端口
app.listen(805,"127.0.0.1",()=>{
    console.log("running...");
});

