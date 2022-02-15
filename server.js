/*
路由业务处理
 */

const  querystring=require("querystring");
const http=require("http");
const request=require("request");
const express=require("express");
const fs=require("fs");
const path=require("path");
const cheerio=require("cheerio");
const database=require("./database");
const md=require("./md5");
var empty_room_arr=[];
var g=0;
var day=0;
var schedule_obj={};
//为课表处理定义的全局变量
// var schedule_obj={};
// var abc=["0","1","week_1","week_2","week_3","week_4","week_5","week_6","week_7","week_8","week_9","week_10","week_11","week_12","week_13","week_14","week_15","week_16","week_17","week_18","week_19","week_20"];

function empty_room(){
    return "__VIEWSTATE=%2FwEPDwUKMTM4NTAzOTE1NA9kFgJmD2QWAgIDD2QWBmYPFgIeBFRleHQFCeeOi%2BaWh%2BadsGQCAQ8WAh8ABQwyMDE3MDIwMzAyMTJkAgIPZBYGAgEPZBYIZg8WAh8ABQnnjovmlofmnbBkAgEPFgIfAAUb5p2Q5paZ5LiO5YyW5a2m5YyW5bel5a2m6ZmiZAICDxYCHwAFEDAyMDPlupTnlKjljJblraZkAgMPFgIfAAUMMjAxNzAyMDMwMjEyZAIFDxAPFgYeDURhdGFUZXh0RmllbGQFBHRleHQeDkRhdGFWYWx1ZUZpZWxkBQJpZB4LXyFEYXRhQm91bmRnZBAVEAALIOaVmeWtpjHmpbwLIOaVmeWtpjLmpbwLIOaVmeWtpjPmpbwLIOaVmeWtpjTmpbwK5pWZ5a2mNealvAsg5YWt5pWZQeW6pwsg5YWt5pWZQuW6pwsg5YWt5pWZQ%2BW6pwrmlZnlraY35qW8CyDmlZnlraY45qW8CyDmlZnlraY55qW8CyDkuJzljLox5pWZCyDkuJzljLoy5pWZEueOr%2BWig%2BWtpumZoumZoualvAzoibrmnK%2FlpKfmpbwVEAAKMDEgICAgICAgIAowMiAgICAgICAgCjAzICAgICAgICAKMDQgICAgICAgIAowNSAgICAgICAgCjA2QSAgICAgICAKMDZCICAgICAgIAowNkMgICAgICAgCjA3ICAgICAgICAKMDggICAgICAgIAoxMCAgICAgICAgCkUxICAgICAgICAKRTIgICAgICAgIAoyMDE5MDAwMDAxClkgICAgICAgICAUKwMQZ2dnZ2dnZ2dnZ2dnZ2dnZ2RkAgsPFgIeC18hSXRlbUNvdW50AjwWeAIBD2QWAmYPFQcFNkExMDEDMTUyDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAgIPZBYCZg8VBwU2QTEwMgMxNjAM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rWQCAw9kFgJmDxUHBTZBMTAzAjM1CeepuumXsuS4rQzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAgQPZBYCZg8VBwU2QTEwNAMxMDgJ56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCBQ9kFgJmDxUHBTZBMTA1AjcwDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAgYPZBYCZg8VBwU2QTEwNwI3MAzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitZAIHD2QWAmYPFQcGNkExMDcyATUJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCCA9kFgJmDxUHBTZBMTA4AjcwDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK1kAgkPZBYCZg8VBwY2QTEwODIBNQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIKD2QWAmYPFQcFNkExMDkDMTYwCeepuumXsuS4rQzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAgsPZBYCZg8VBwU2QTExMAMxNjAJ56m66Zey5LitCeepuumXsuS4rQzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rWQCDA9kFgJmDxUHBTZBMjAxAzEwMAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIND2QWAmYPFQcFNkEyMDIDMTYwDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAg4PZBYCZg8VBwU2QTIwMwI0MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIPD2QWAmYPFQcFNkEyMDQCNzAM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCEA9kFgJmDxUHBTZBMjA1AzEwMAzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitZAIRD2QWAmYPFQcFNkEyMDYCNzAJ56m66Zey5LitDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rWQCEg9kFgJmDxUHBTZBMjA3AjcwCeepuumXsuS4rQzmraPluLjmlZnlraYJ56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK1kAhMPZBYCZg8VBwU2QTIwOAI3MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIUD2QWAmYPFQcFNkEyMDkDMTYwDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAhUPZBYCZg8VBwU2QTIxMAMxNjAM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitDOato%2BW4uOaVmeWtpmQCFg9kFgJmDxUHBTZBMzAxAzE1Mgnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIXD2QWAmYPFQcFNkEzMDIDMTYwCeepuumXsuS4rQzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAhgPZBYCZg8VBwU2QTMwNAMxMDgM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCGQ9kFgJmDxUHBTZBMzA1AzEwOAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIaD2QWAmYPFQcFNkEzMDYDMTA4CeepuumXsuS4rQzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAhsPZBYCZg8VBwU2QTMwNwI3MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIcD2QWAmYPFQcFNkEzMDgDMTA4CeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAh0PZBYCZg8VBwU2QTMwOQMxNjAM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCHg9kFgJmDxUHBTZBMzEwAzE2MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIfD2QWAmYPFQcFNkE0MDEDMTUyCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAiAPZBYCZg8VBwU2QTQwMgMxNjAJ56m66Zey5LitCeepuumXsuS4rQzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rWQCIQ9kFgJmDxUHBTZBNDA0AzEwOAnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rQzmraPluLjmlZnlraYJ56m66Zey5LitZAIiD2QWAmYPFQcFNkE0MDUCNzAJ56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCIw9kFgJmDxUHBTZBNDA2AzEwOAnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIkD2QWAmYPFQcFNkE0MDcCNzAJ56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCJQ9kFgJmDxUHBTZBNDA4AzEwOAnnqbrpl7LkuK0J56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitZAImD2QWAmYPFQcFNkE0MDkDMTYwCeepuumXsuS4rQnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAicPZBYCZg8VBwU2QTQxMAI4MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIoD2QWAmYPFQcFNkE1MDECOTAJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rWQCKQ9kFgJmDxUHBTZBNTAyAjkwCeepuumXsuS4rQnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK1kAioPZBYCZg8VBwU2QTUwMwI5MAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIrD2QWAmYPFQcFNkE1MDQCNjUM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rWQCLA9kFgJmDxUHBTZBNTA2AjYyCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAi0PZBYCZg8VBwU2QTUwOAI2Mgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAIuD2QWAmYPFQcFNkE1MDkCODUJ56m66Zey5LitDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0M5q2j5bi45pWZ5a2mCeepuumXsuS4rWQCLw9kFgJmDxUHBTZBNTEwAjg1CeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjAPZBYCZg8VBwU2QTYwMQIzMAzmraPluLjmlZnlraYJ56m66Zey5LitDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitZAIxD2QWAmYPFQcFNkE2MDICMzAM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCMg9kFgJmDxUHBTZBNjAzAjMwCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjMPZBYCZg8VBwU2QTYwNAIzMAzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAI0D2QWAmYPFQcFNkE2MDUCMzAJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rWQCNQ9kFgJmDxUHBTZBNjA2AjMwDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjYPZBYCZg8VBwU2QTYwNwIzMAnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitZAI3D2QWAmYPFQcHNkE2MDctMQEwCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjgPZBYCZg8VBwU2QTYwOAIzMAzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitZAI5D2QWAmYPFQcFNkE2MDkCMzAM5q2j5bi45pWZ5a2mDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYM5q2j5bi45pWZ5a2mCeepuumXsuS4rWQCOg9kFgJmDxUHBTZBNjEwAjMwDOato%2BW4uOaVmeWtpgzmraPluLjmlZnlraYJ56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjsPZBYCZg8VBwc2QTYxMF8xAjMwCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kAjwPZBYCZg8VBwc2QTYxMF8yAjMwCeepuumXsuS4rQnnqbrpl7LkuK0J56m66Zey5LitCeepuumXsuS4rQnnqbrpl7LkuK1kZObrSDAd7ehtCxPKhrgIa2f5q8uHArB2alNSFOwU%2BhNy&__VIEWSTATEGENERATOR=7EB77B99&__EVENTVALIDATION=%2FwEdABO7WcgDDYT%2BieD1zylMJTU%2FWKVrV%2FLgio6ll2hdQg88Z1pgy3TOwf55SgKe3aJtBQY4yAAHayGEuMf65kg5Klk224f2Al1AH5b%2Fxiz9s5fvLPJwA3zBPnLkFkgzqryBi6trDleyZpCqGaamlthPjHmPdrkL0TfgYyELCva3D0Ve6KHTYUmdKOl4qV8qwZijiXFsXtRv8UlWIoHf5PM8c8aQVN8s9VX8WrZNmNtHmNQJgJYdUhK3iAiW0IV7Tay%2BPXw8vhcrrpaNPjpoUMQJYGox0oYAIAS%2Fiw%2BrJm6WVjSFW14Sxp17ITOZiKiRy8sV0zYmM2Kupxk7Yklf2l3IPPpRxLZG7YIsS0bit5HkRaMF3BtU%2F3ZrhT%2F8zMWFKEDqp5u%2FyqKEJMuSIyrmp3tBm%2BXHye43DDQNw6Gb4M68G5%2B8Mt6HEWnulO3Cj4tNK4eAVO0%3D&"
}
//生成stu_no和pwd并更新到数据库
function getStuNo(){
    //生成八位随机数
    let range=10000000000000000;
    let stu_no=(range*Math.random()+"").substr(0,16);
    return stu_no;
}
//模拟登录学校服务器并获取session_id
function simulatedLogin_1(req,res){
	var sign = new Date().getTime();
	var signedpwd =md.hex_md5(req.body.userName + sign + md.hex_md5(req.body.pwd.trim()));
	data = { Action: "Login", userName: req.body.userName, pwd: signedpwd, sign:sign };
	const postData =querystring.stringify(data);
	console.log(postData);
	const options = {
		host: 'jwxtxs.cdut.edu.cn',
		port: 805,
		path: '/Common/Handler/UserLogin.ashx',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
	const reqLogin = http.request(options, (res_server) => {
		console.log("set-cookie：" + res_server.headers["set-cookie"]);
		console.log(`状态码: ${res_server.statusCode}`);
		console.log(`响应头: ${JSON.stringify(res_server.headers)}`);
		res_server.setEncoding('utf8');
		res_server.on('data', (chunk) => {
			if (chunk==0){
				var stu_no=getStuNo();
				
				
				console.log("set-cookie："+res_server.headers["set-cookie"]);
				var cookie=res_server.headers["set-cookie"];
				console.log(cookie);
				var cookie0=cookie[0].slice(0,cookie[0].indexOf(";"));
				var cookie1=cookie[1].slice(0,cookie[1].indexOf(";"));
				var cookie01=cookie0+";"+cookie1;
				console.log("_coocie01_:"+cookie01);
				
				let tpl=`update t_login set pwd=?, cookie01=?, _sign=?, stu_no=? where name=? and id=?`;
				let data=[signedpwd,cookie01,sign,stu_no,req.body.userName,req.body.pwd];
				
				database.dbs(tpl,data,(results)=>{
					console.log(results);
				});
				res.send({stateCode:"0",stu_no:stu_no});
			}else{
				//=====================此处应该判断返回值是否为零，并做处理，
				//登陆失败会造成服务器崩溃
				res.send(chunk);
				return;
			}
			console.log("chunk:" + chunk);
			console.log(`响应主体: ${chunk}`);
		});
		res_server.on('end', () => {
			console.log('响应中已无数据');
			//console.log("chunk:"+chunk);
		});
	});
	reqLogin.on('error', (e) => {
		console.error(`请求遇到问题: ${e.message}`);
	});
	// 将数据写入请求主体。
	reqLogin.write(postData);
	reqLogin.end();
}
function simulatedLogin(req,res){
	var sign = new Date().getTime();
	var signedpwd =md.hex_md5(req.body.userName + sign + md.hex_md5(req.body.pwd.trim()));
	data = { Action: "Login", userName: req.body.userName, pwd: signedpwd, sign:sign };
	const postData =querystring.stringify(data);
	console.log(postData);
	const options = {
		host: '202.115.137.77',
		port: 805,
		path: '/Common/Handler/UserLogin.ashx',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
	const reqLogin = http.request(options, (res_server) => {
		console.log("set-cookie：" + res_server.headers["set-cookie"]);
		console.log(`状态码: ${res_server.statusCode}`);
		console.log(`响应头: ${JSON.stringify(res_server.headers)}`);
		res_server.setEncoding('utf8');
		res_server.on('data', (chunk) => {
			console.log("+++++++++++++++++++++++++");
			if (chunk==0){
				console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{");

				var stu_no=getStuNo();
				
				
				console.log("set-cookie："+res_server.headers["set-cookie"]);
				var cookie=res_server.headers["set-cookie"];
				console.log(cookie);
				var cookie0=cookie[0].slice(0,cookie[0].indexOf(";"));
				var cookie1=cookie[1].slice(0,cookie[1].indexOf(";"));
				var cookie01=cookie0+";"+cookie1;
				console.log("_coocie01_:"+cookie01);
				
				let tpl=`insert into t_login set?`;
				let data={
					name:req.body.userName,
					id:req.body.pwd,
					pwd:signedpwd,
					cookie01:cookie01,
					_sign:sign,
					stu_no:stu_no
				}
				
				database.dbs(tpl,data,(results)=>{
					console.log(results);
				});
				res.send({stateCode:"0",stu_no:stu_no});
			}else{
				console.log("//////////////////////////////");
				//=====================此处应该判断返回值是否为零，并做处理，
				//登陆失败会造成服务器崩溃
				res.send(chunk);
				return;
			}
			console.log("chunk:" + chunk);
			console.log(`响应主体: ${chunk}`);
		});
		res_server.on('end', () => {
			console.log('响应中已无数据');
		//	console.log("chunk:"+chunk);
		});
	});
	reqLogin.on('error', (e) => {
		console.error(`请求遇到问题: ${e.message}`);
	});
	// 将数据写入请求主体。
	reqLogin.write(postData);
	reqLogin.end();
}
//登陆验证
exports.login=(req,res)=>{
	console.log(req.body);
    let tpl=`select name from t_login where name=? and id=?`;
    let data=[req.body.userName,req.body.pwd];
    database.dbs(tpl,data,(results)=>{
        if(results.length==1){
            //生成stu_no并更新到数据库
			
            simulatedLogin_1(req,res);
        }else{
			console.log("=================================");
			simulatedLogin(req,res);
        }
    });
}
//返回主页
exports.query=(req,res)=>{
	
    res.render(`index.art`,{"random_no":req.query.stu_no});
}

//渲染并返回分数页面
exports.score=(req,res)=>{
    let tpl=`select cookie01 from t_login where stu_no=?`;
    let data=[req.query.random_no];
    database.dbs(tpl,data,(results)=>{
		
		if(!results[0]){
			res.redirect("/public/login.html");
			return;
		}else{
			request({
			    url:"http://jwxtxs.cdut.edu.cn:805/SearchInfo/Score/ScoreList.aspx ",
			    method: "POST",
			    headers: {
			        'Content-Type':'application/x-www-form-urlencoded',
			        'Cookie': results[0].cookie01
			    }
			},(err,response,body)=>{
			    if(err){
			        console.log("err:"+err);
			    }else {
			        //console.log(body);
			        let $=cheerio.load(body);
			        let score_data=$(".score_right_infor_list li");
			        let scoreArr=[];
			
			        for(let i=1;i<score_data.length;i++){
			            let scoreInfo={term:score_data[i].children[1].children[0].data.replace(/[\n\s]/g,""),
			                courseCode:score_data[i].children[3].children[0].data.replace(/[\n\s]/g,""),
			                courseName:score_data[i].children[5].children[0].data.replace(/[\n\s]/g,""),
			                academicCredit:score_data[i].children[9].children[0].data.replace(/[\n\s]/g,""),
			                score:score_data[i].children[11].children[0].data.replace(/[\n\s]/g,""),
			                status:score_data[i].children[13].children[0].data.replace(/[\n\s]/g,""),
			                gradePoint:score_data[i].children[15].children[0].data.replace(/[\n\s]/g,""),
			                teacher:score_data[i].children[17].children[0].data.replace(/[\n\s]/g,""),
			                importTime:score_data[i].children[19].children[0].data.replace(/[\n\s]/g,"")}
			            scoreArr.push(scoreInfo);
			            //console.log(scoreInfo);
			        }
			        res.render("scoreList",{list:scoreArr});
			        //console.log("break...");
			    }
			});
		}
		// 
        //console.log(results);
        
    });
}
//课表数据处理和渲染业务处理
function getScheduleInfo(req,res){
	let tpl=`select cookie01,name from t_login where stu_no=?`;
	let data=[req.query.random_no];
	
	database.dbs(tpl,data,(results)=>{
		if (!results[0]) {
			res.redirect("/public/login.html");
			return;
		} else{
			request({
			    url:"http://jwxtxs.cdut.edu.cn:805/Classroom/ProductionSchedule/StuProductionSchedule.aspx?termid=201902&stuID="+results[0].name,
			    method: "POST",
			    headers: {
			        'Content-Type':'application/x-www-form-urlencoded',
			        'Cookie': results[0].cookie01
			    }
			},(err,response,body)=>{
			    if(err){
			        console.log("err:"+err);
			    }else {
					//加载学校服务器返回的渲染后的页面
					//console.log(body);
			        let $=cheerio.load(body);
			        let schedule_info=$(".tab1 tr");
			        
			        for(let i=2;i<schedule_info.length;i++) {
			        	week_schedule_arr=[];
			            let day_schedule_arr=[];
			        	day_obj={};
			            for (let j=3;j<schedule_info[i].children.length;j+=2){
			                if (schedule_info[i].children[j].attribs.align == undefined) {
			                    //处理课程表上完全空白的数据
			        			day_schedule_arr.push({"class":"","academic_hour":""});
			        			g+=1;
			        			//console.log(g);
			        			if(g%12==0){
			        				day++;
			        				switch(day){
			        					case 1:
			        						day_obj.day_1=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 2:
			        						day_obj.day_2=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 3:
			        						day_obj.day_3=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 4:
			        						day_obj.day_4=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 5:
			        						day_obj.day_5=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 6:
			        						day_obj.day_6=day_schedule_arr;
			        						day_schedule_arr=[];
			        						break;
			        					case 7:
			        						day_obj.day_7=day_schedule_arr;
			        						day_schedule_arr=[];
			        						day=0;
			        						break;
			        				}
			        			}
			        			
			                    
			                } else {
			                    //处理课程表上不为空白的数据
			                    if(schedule_info[i].children[j].children[0].next==null){
			                        //处理大于一节课的数据，包括但不限于法定节假日，四六级，但不包括任何课程数据
			        				day_schedule_arr.push({"class":schedule_info[i].children[j].children[0].data,"academic_hour":schedule_info[i].children[j].attribs.colspan});
			                        g+=parseInt(schedule_info[i].children[j].attribs.colspan);
			        				//console.log(g);
			        				//console.log(g);
			        				if(g%12==0){
			        					//console.log("================================");
			        					day++;
			        					switch(day){
			        						case 1:
			        							day_obj.day_1=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 2:
			        							day_obj.day_2=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 3:
			        							day_obj.day_3=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 4:
			        							day_obj.day_4=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 5:
			        							day_obj.day_5=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 6:
			        							day_obj.day_6=day_schedule_arr;
			        							day_schedule_arr=[];
			        							break;
			        						case 7:
			        							day_obj.day_7=day_schedule_arr;
			        							day_schedule_arr=[];
			        							day=0;
			        							break;
			        					}
			        				}
			        
			        
			                        
			                        //console.log(schedule_info[i].children[0].data + "--" + schedule_info[i].attribs.colspan);
			                    }else {
			        
			                        //处理正式的不为空白的只有一节课的课程数据
			                        if(schedule_info[i].children[j].attribs.colspan==undefined){
			        					day_schedule_arr.push({"class":schedule_info[i].children[j].children[0].data + "/" +schedule_info[i].children[j].children[0].next.next.children[0].data,"academic_hour":"1"});
			                            g+=1;
			        					//console.log(g);
			        					if(g%12==0){
			        						//console.log("================================");
			        						day++;
			        						switch(day){
			        							case 1:
			        								day_obj.day_1=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 2:
			        								day_obj.day_2=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 3:
			        								day_obj.day_3=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 4:
			        								day_obj.day_4=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 5:
			        								day_obj.day_5=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 6:
			        								day_obj.day_6=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 7:
			        								day_obj.day_7=day_schedule_arr;
			        								day_schedule_arr=[];
			        								day=0;
			        								break;
			        						}
			        					}
			                            
			                            //console.log(schedule_info[i].children[0].data + "/" +schedule_info[i].children[0].next.next.children[0].data + "--" + 1);
			        
			                        }else {
			        
			                            //处理大于一节的课程数据
			        
			                            day_schedule_arr.push({"class":schedule_info[i].children[j].children[0].data + "/" +schedule_info[i].children[j].children[0].next.next.children[0].data,"academic_hour":schedule_info[i].children[j].attribs.colspan});
			                            g+=parseInt(schedule_info[i].children[j].attribs.colspan);
			        					//console.log(g);
			        					if(g%12==0){
			        						//console.log("================================");
			        						day++;
			        						switch(day){
			        							case 1:
			        								day_obj.day_1=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 2:
			        								day_obj.day_2=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 3:
			        								day_obj.day_3=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 4:
			        								day_obj.day_4=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 5:
			        								day_obj.day_5=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 6:
			        								day_obj.day_6=day_schedule_arr;
			        								day_schedule_arr=[];
			        								break;
			        							case 7:
			        								day_obj.day_7=day_schedule_arr;
			        								day_schedule_arr=[];
			        								day=0;
			        								break;
			        						}
			        					}
			                        }
			        
			                    }
			        
			                }
			            }
			        	//console.log(day_obj);
			            switch (i) {
			                case 2:
			        			week_schedule_arr.push(day_obj)
			                    schedule_obj.week_1=week_schedule_arr;
			                    break;
			                case 3:
			        			week_schedule_arr.push(day_obj)
			                    schedule_obj.week_2=week_schedule_arr;
			                    break;
			                case 4:
			        			week_schedule_arr.push(day_obj)
			                    schedule_obj.week_3=week_schedule_arr;
			                    break;
			                case 5:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_4=week_schedule_arr;
			                    break;
			                case 6:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_5=week_schedule_arr;
			                    break;
			                case 7:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_6=week_schedule_arr;
			                    break;
			                case 8:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_7=week_schedule_arr;
			                    break;
			                case 9:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_8=week_schedule_arr;
			                    break;
			                case 10:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_9=week_schedule_arr;
			                    break;
			                case 11:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_10=week_schedule_arr;
			                    break;
			                case 12:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_11=week_schedule_arr;
			                    break;
			                case 13:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_12=week_schedule_arr;
			                    break;
			                case 14:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_13=week_schedule_arr;
			                    break;
			                case 15:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_14=week_schedule_arr;
			                    break;
			                case 16:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_15=week_schedule_arr;
			                    break;
			                case 17:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_16=week_schedule_arr;
			                    break;
			                case 18:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_17=week_schedule_arr;
			                    break;
			                case 19:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_18=week_schedule_arr;
			                    break;
			                case 20:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_19=week_schedule_arr;
			                    break;
			                case 21:
			                    week_schedule_arr.push(day_obj)
			                    schedule_obj.week_20=week_schedule_arr;
			                    break;
			            }
			        }
				}	
				//console.log(req.query.week_no);
				switch (req.query.week_no) {
				    case "week_1":
						res.render("schedule_table",{list:schedule_obj.week_1,random_no:req.query.random_no,select_week:"第一周"});
				        break;
				    case "week_2":
						//console.log(schedule_obj.week_2);
						res.render("schedule_table",{list:schedule_obj.week_2,random_no:req.query.random_no,select_week:"第二周"});
				        break;
				    case "week_3":
						res.render("schedule_table",{list:schedule_obj.week_3,random_no:req.query.random_no,select_week:"第三周"});
				        break;
				    case "week_4":
				       res.render("schedule_table",{list:schedule_obj.week_4,random_no:req.query.random_no,select_week:"第四周"});
				        break;
				    case "week_5":
				        res.render("schedule_table",{list:schedule_obj.week_5,random_no:req.query.random_no,select_week:"第五周"});
				        break;
				    case "week_6":
				        res.render("schedule_table",{list:schedule_obj.week_6,random_no:req.query.random_no,select_week:"第六周"});
				        break;
				    case "week_7":
				        res.render("schedule_table",{list:schedule_obj.week_7,random_no:req.query.random_no,select_week:"第七周"});
				        break;
				    case "week_8":
				       res.render("schedule_table",{list:schedule_obj.week_8,random_no:req.query.random_no,select_week:"第八周"});
				        break;
				    case "week_9":
				        res.render("schedule_table",{list:schedule_obj.week_9,random_no:req.query.random_no,select_week:"第九周"});
				        break;
				    case "week_10":
				        res.render("schedule_table",{list:schedule_obj.week_10,random_no:req.query.random_no,select_week:"第十周"});
				        break;
				    case "week_11":
				       res.render("schedule_table",{list:schedule_obj.week_11,random_no:req.query.random_no,select_week:"第十一周"});
				        break;
				    case "week_12":
				        res.render("schedule_table",{list:schedule_obj.week_12,random_no:req.query.random_no,select_week:"第十二周"});
				        break;
				    case "week_13":
				        res.render("schedule_table",{list:schedule_obj.week_13,random_no:req.query.random_no,select_week:"第十三周"});
				        break;
				    case "week_14":
				       res.render("schedule_table",{list:schedule_obj.week_14,random_no:req.query.random_no,select_week:"第十四周"});
				        break;
				    case "week_15":
				        res.render("schedule_table",{list:schedule_obj.week_15,random_no:req.query.random_no,select_week:"第十五周"});
				        break;
				    case "week_16":
				       res.render("schedule_table",{list:schedule_obj.week_16,random_no:req.query.random_no,select_week:"第十六周"});
				        break;
				    case "week_17":
				       res.render("schedule_table",{list:schedule_obj.week_17,random_no:req.query.random_no,select_week:"第十七周"});
				        break;
				    case "week_18":
				        res.render("schedule_table",{list:schedule_obj.week_18,random_no:req.query.random_no,select_week:"第十八周"});
				        break;
				    case "week_19":
				        res.render("schedule_table",{list:schedule_obj.week_19,random_no:req.query.random_no,select_week:"第十九周"});
				        break;
				     case "week_20":
					    res.render("schedule_table",{list:schedule_obj.week_20,random_no:req.query.random_no,select_week:"第二十周"});
				         break;
				}
				// var schedule_arr=schedule_obj.req.query.week_no;
				// res.render("schedule_table",{list:schedule_arr,random_no:req.query.random_no});
			});
		}
	    
	});
}
//渲染并返回课表页面
exports.schedules=(req,res)=>{
    if (req.query.week_no) {
		//console.log(req.query.week_no);
    	getScheduleInfo(req,res,week_no=req.query.week_no);
    } else{
		//默认显示课表页面
    	res.render("schedule_table",{random_no:req.query.random_no});
    }
}
//查询教室数据业务处理
function getEmptyRoomInfo(req,res,tpl,data,postData){
	database.dbs(tpl,data,(results)=>{
	    if (!results[0]) {
	    	res.redirect("/public/login.html");
			return;
	    } else{
	    	const options = {
	    	    host: 'jwxtxs.cdut.edu.cn',
	    	    port: 805,
	    	    path: '/SearchInfo/Building/EmptyClassRoom.aspx',
	    	    method: 'POST',
	    	    headers: {
	    	        'Content-Type': 'application/x-www-form-urlencoded',
	    	        'Cookie':results[0].cookie01,
	    	        'Content-Length': Buffer.byteLength(postData)
	    	    }
	    	};

	    	const reqLogin = http.request(options, (res_server) => {
	    	    console.log(`状态码: ${res_server.statusCode}`);
	    	    console.log(`响应头: ${JSON.stringify(res_server.headers)}`);
	    		
	    	    let classRoomData='';
	    	    res_server.on('data', (chunk) => {
	    	        classRoomData+=chunk;
	    	    });
	    		
	    	    res_server.on('end', () => {
	    	        console.log('响应中已无数据');
	    	        //fs.writeFile(path.join(__dirname,"abc.txt"),classRoomData,(err)=>{
	    	        //    if(err)throw err;
	    	        //    console.log("finished!");
	    	            var $=cheerio.load(classRoomData);
	    	            var content=$(".item");
	    	            for (let i=0;i<content.length;i++){
	    	                let room_obj={};
	    	                for (let j=1;j<14;j+=2){
	    	                    switch (j) {
	    	                        case 1:
	    	                           room_obj.room_no= content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                           break;
	    	                        case 3:
	    	                            room_obj.seats=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                        case 5:
	    	                            room_obj.class_A=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                        case 7:
	    	                            room_obj.class_B=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                        case 9:
	    	                            room_obj.class_C=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                        case 11:
	    	                            room_obj.class_D=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                        case 13:
	    	                            room_obj.class_E=content[i].children[j].children[0].data.replace(/\n/g,"").trim();
	    	                            break;
	    	                    }
	    		
	    	                }
	    	                empty_room_arr.push(room_obj);
	    	            }
	    	            //console.log(empty_room_arr);
	    				res.render("empty_class_room",{list:empty_room_arr,random_no:req.query.random_no});
	    				empty_room_arr=[];
	    	       // });
	    	    });
	    	});
	    	reqLogin.on('error', (e) => {
	    		
	    	    console.error(`请求遇到问题: ${e.message}`);
	    	});
	    		
	    	// 将数据写入请求主体。
	    	reqLogin.write(postData);
	    	reqLogin.end();
	    }
	    
	    
	});
}
//查询空教室
exports.emptyClassRoomQuery=(req,res)=>{
	console.log(req.query);
	let search_str="="+req.query.ctl00$Content$dllTeachingBuilding;
	let replace_str=(search_str+"++++++++++").substr(0,11);
	if(req.query.ctl00$Content$dllTeachingBuilding){
		let tpl=`select cookie01 from t_login where stu_no=?`
		let data=[req.query.random_no];
		let postData;
		let query_obj={
			ctl00$Content$dllTeachingBuilding:req.query.ctl00$Content$dllTeachingBuilding,
			ctl00$Content$EmptyDate:req.query.ctl00$Content$EmptyDate
		};
		console.log(querystring.stringify(req.query));
		getEmptyRoomInfo(req,res,tpl,data,postData=empty_room()+querystring.stringify(query_obj).replace(search_str,replace_str)+"&ctl00%24Content%24btnSubmit=%E6%9F%A5%E8%AF%A2");
	}else{
		//console.log(req.query);
		let tpl=`select cookie01 from t_login where stu_no=?`
		let data=[req.query.random_no];
		let postData;
		getEmptyRoomInfo(req,res,tpl,data,postData="");
	}
	
 //    let tpl=`select cookie01 from t_login where name=?`
 //    let data=[201702030212];
	// // let tpl=`select cookie01 from t_login where stu_no=?`;
	// // let data=[req.query.random_no];
	// getEmptyRoomInfo(req,res);
}
