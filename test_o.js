const fs=require("fs");
const cheerio=require("cheerio");
const path=require("path");
const mysql = require('mysql');
const database=require("./database.js");


 let tpl=`select cookie01 from t_login where stu_no=?`;
    let data=[663465113238922];
database.dbs(tpl,data,(resultes)=>{
	if(!resultes[0])
	console.log("重定向");
});