function checklogin(){
    var id = document.getElementById("txtId"),
        password = document.getElementById("txtPassword"),
        msg = "", guide1 = "필수항목 ", guide2 = " 입력하십시오.";

    console.log("checklogin");

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

    document.user.submit();
}