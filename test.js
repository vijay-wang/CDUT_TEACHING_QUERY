const fs=require("fs");
const cheerio=require("cheerio");
const path=require("path");
var g=0;
var arr_schedule=[];

function fun(){

}

fs.readFile(path.join(__dirname,"schedules.txt"),"utf8",(err,data)=>{
    if(err)throw err;
    let $=cheerio.load(data);
    let content=$(".tab3 .title1");
    //console.log(content.text());
    let content_info=content.text().replace(/    /g,"\",\"")
        .replace(/   /g,"\",\"")
        .replace(/:/g,"\":\"")
        .replace("学号","stu_no")
        .replace("姓名","name")
        .replace("班级","class")
        .replace("学院/专业","college")
        .replace("年级","grade")
        .replace("生成日期","date");
    let content_obj="{\""+content_info+"\"}"
    console.log(typeof JSON.parse(content_obj));



    let schedule_info=$(".tab1 tr td");
    // for (let i=2;i<schedule_info.length-1;i++){
    //     for (let j=1;j<)
    // }


    for(let i=50;i<schedule_info.length;i++) {
        //处理课程数据
        if (schedule_info[i].attribs.align == undefined) {
            //处理课程表上完全空白的数据
            if(g%85==0){
                console.log("==========================")
            }
            g++;

           arr_schedule.push({"class":"","academic_hour":""});

            //console.log("空");
        } else {
            //处理课程表上不为空白的数据
            if(schedule_info[i].children[0].next==null){
                //处理大于一节课的数据，包括但不限于法定节假日，四六级，但不包括任何课程数据
                if(g%85==0){
                    console.log("==========================")
                }
                g+=parseInt(schedule_info[i].attribs.colspan);


                arr_schedule.push({"class":schedule_info[i].children[0].data,"academic_hour":schedule_info[i].attribs.colspan});
                //console.log(schedule_info[i].children[0].data + "--" + schedule_info[i].attribs.colspan);
            }else {

                //处理正式的不为空白的只有一节课的课程数据
                if(schedule_info[i].attribs.colspan==undefined){
                    if(g%85==0){
                        console.log("==========================")
                    }
                    g+=1;
                    arr_schedule.push({"class":schedule_info[i].children[0].data + "/" +schedule_info[i].children[0].next.next.children[0].data,"academic_hour":"1"});
                    //console.log(schedule_info[i].children[0].data + "/" +schedule_info[i].children[0].next.next.children[0].data + "--" + 1);

                }else {

                    //处理大于一节的课程数据
                    if(g%85==0){
                        console.log("==========================")
                    }
                    g+=parseInt(schedule_info[i].attribs.colspan);

                    arr_schedule.push({"class":schedule_info[i].children[0].data + "/" +schedule_info[i].children[0].next.next.children[0].data,"academic_hour":schedule_info[i].attribs.colspan});

                   // console.log(schedule_info[i].children[0].data + "/" +schedule_info[i].children[0].next.next.children[0].data + "--" + schedule_info[i].attribs.colspan);
                }

            }

        }
    }

    let arr_json={"item":arr_schedule};
    console.log(typeof  arr_json);
    fs.writeFile(path.join(__dirname,"schedule_arr.json"),JSON.stringify(arr_json),"utf8",(err)=>{
        if(err)throw err;
       console.log(arr_json);
    });
});