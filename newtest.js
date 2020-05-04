const database=require("./database");

let range=10000000000000000;
let stu_no=Math.random();
console.log(stu_no);
let tpl=`UPDATE t_login SET stu_no=? WHERE name = ?`;
let data=[stu_no,201702030212];
//将随机数更新到数据库
database.dbs(tpl,data,(results)=>{
    if(results.affectedRows==1){
        res.send({"stateCode":"0","stu_no":stu_no});
    }
});