function checklogin(){
    var id = document.getElementById("txtId"),
        password = document.getElementById("txtPassword"),
        msg = "", guide1 = "필수항목 ", guide2 = " 입력하십시오.",
        param = "";

    if(typeof id.value === "undefined" || id.value === undefined || id.value === ""){
        id.focus();

        msg = "[아이디]를";
        alert(guide1 + msg + guide2);
        return;
    }
    if(typeof password.value === "undefined" || password.value === undefined || password.value === ""){
        password.focus();

        msg = "[비밀번호]를";
        alert(guide1 + msg + guide2);
        return;
    }

    param = "userId=" + id.value + "&userPassword=" + password.value;

    $.ajax({
        url: "/",
        dataType: "json",
        type: "post",
        data : param,
        success:successLogin,
        error: failLogin
    })

};
function successLogin(data, res){
    //user.data = data;
    window.location = "/main";
    //console.log(data);
};
function failLogin(){
    $("#login_errMsg").text("로그인 정보를 확인하여 주십시오.").show();
};


function checkMt(){


    document.make_mt.submit();
};

function updateMt(){


    document.update_mt.submit();
};

function cancelMt(){


    document.cancel_mt.submit();
};

function resetPassword(){
    document.resetpassword.submit();
};