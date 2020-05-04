//for students
function UserLogin(userName, pwd) {

   
    var user = userName.trim();
    // var signedpwd = hex_md5(user + sign + hex_md5(pwd.trim()));

    var data = {userName: user, pwd: pwd};
    var url = "http://127.0.0.1:805/login";
	
    $.post(url, data, function (rs) {
        //alert(rs);
        //alert("heko");

        if (rs.stateCode == "0") {

            window.location.href = "/index?stu_no="+rs.stu_no;
        } else {
            $(".loading").hide();
            if (rs == "4" || rs == "2" || rs == "1") {
                alert("密码或者用户名错误");
            }
            else if (rs == "3") {
                alert("账户已经被锁定，请登陆学生缴费平台核对缴费信息，完成缴费后24小时候解锁系统");

            }

        }
    });


}

//用户退出登录
function UserLoginOut() {

    var data = { Action: "LoginOut" };
    var url = "/Common/Handler/UserLogin.ashx";
    $(".loading").show();

    $.post(url, data, function (rs) {

        if (rs == "0") {

            window.location.href = "/login.html";
        } else {
            //mini.alert("退出登录失败，请再试");
            window.location.href = "/login.html";
            //$(".loading").hide();
        }
    });
}


//菜单操作
$(document).ready(function () {
    /*
    setTimeout(
    function () {
    
        $('*[target = "main"]').click(function () {
            var name = $(this).html();
            var memo = $(this).attr("memo");

            $("#FnName").html(name);
            $("#FnNotice").html(memo);
        });
    }, 500);
    */
});