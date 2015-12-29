function init(){
    if($(".login_wrapper").length === 0) $(document.body).addClass("main");
    else $(document.body).removeClass("main");

    user.init();
    //calendar.init();
    bindEvent();

};
function bindEvent(){
    $(".reservation td > a").on("click",function(){reservation.movePage($(this));});

    $("#txtDate").on("click", calendar.init);

}




var reservation = {
    data : {

        // DB data binding
    },
    movePage : function(obj){
        var that = obj, _offset = that.offset();
        console.log(that.offset());
        // open registReservation
        //$("#mask").show();
        //$("#registReservation").show();

        // open modifyReservation
        $("#btnModify").hide();
        $("#btnDelete").hide();
        $("#modifyReservation").css({top : _offset.top + 8, left : _offset.left + 8}).show();

    }
}
var user = {
    data : {},
    init : function(){
        $("#btnUser").on("click", this.display);
        $("#btnConfirmUser").on("click", this.update);
        $("#btnOkUser").on("click", this.hide);
    },
    display : function(){
        $("#mask").show();
        $("#modifyUser").show();
    },
    hide : function(){
        $("#modifyUser").hide();
        $("#mask").hide();
    },
    update : function(){
        user.getData();

        if(!user.checkValue()) return;

        var param = "userId=" + user.data.newPassword1 +
                    "&org_password=" + user.data.oldPassword +
                    "&new_password=" + user.data.newPassword1 +
                    "&new_username=" + user.data.username ;


        console.log(param);
        $.ajax({
            url: "/users",
            dataType: "json",
            type: "post",
            data : param,
            success:function(){console.log("success!!");},
            error: function(){console.log("fail!!");}
        })

        user.resetData();

    },
    getData : function(){
        this.data.oldPassword = $("#old_password").val();
        this.data.newPassword1 = $("#new_password1").val();
        this.data.newPassword2 = $("#new_password2").val();
        this.data.username = $("#new_username").val();
    },
    resetData :function(){
        this.data.oldPassword = '';
        this.data.newPassword1 = '';
        this.data.newPassword2 = '';

        $("#old_password").val(this.data.oldPassword);
        $("#new_password1").val(this.data.newPassword1);
        $("#new_password2").val(this.data.newPassword2);
    },
    checkValue : function(){
        var msg = '';
        if(common.isEmpty(this.data.oldPassword)){
            msg = '[기존 비밀번호]를 등록하여 주십시오.';
            $("#user_errMsg").text(msg);
            return false;
        }
        if(common.isEmpty(this.data.newPassword1)){
            msg = '[신규 비밀번호]를 등록하여 주십시오.';
            $("#user_errMsg").text(msg);
            return false;
        }
        if(common.isEmpty(this.data.newPassword2)){
            msg = '[비밀번호 확인]를 확인하여 주십시오.';
            $("#user_errMsg").text(msg);
            return false;
        }
        if(this.data.newPassword1 !== this.data.newPassword2){
            msg = '[신규 비밀번호]와 [비밀번호 확인]이 다릅니다.';
            $("#user_errMsg").text(msg);
            return false;
        }

        return true;
    }
}
var calendar = {
    date : {select : '', current : ''},
    setCurrentDate : function(){
        var _date = new Date(),
            _yyyy = _date.getFullYear().toString(),
            _mm = (_date.getMonth() + 1).toString(),
            _dd = _date.getDate().toString();
        this.date.current = _yyyy + "-" + (_mm[1]? _mm : '0'+ _mm[0]) + "-" + (_dd[1]? _dd : '0' + _dd[0]);
    },
    getCurrentDate : function(){
        return this.date.current;
    },
    init : function(){
        var cal = $('#calendar');

        calendar.setCurrentDate();

        cal.clndr({
            template: $('#calendar-template').html(),
            events: [
                { date: '2015-12-28' }
            ],
            clickEvents: {
                click: function(target) {
                    calendar.date.select = target.date._i;
                    cal.hide();
                }
            }
        });
    }
};

var common = {
    isEmpty : function(val){
        return (typeof val === "undefined" || val === undefined || val === "")? true : false;
    }
};
function setDayToCalendar(year,month,day){

    var clndrInstanse = $('#calendar').clndr();
    var eventArray = [
        {
            date: '2015-12-27', // year+'-'+month+'-'+day'
            title: 'Single Day Event'
        }
    ];
    clndrInstanse.setEvents(eventArray);
};
