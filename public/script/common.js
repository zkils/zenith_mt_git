function init(){
    if($(".login_wrapper").length === 0){
        $(document.body).addClass("main");
        reservation.init();
        user.init();
        bindEvent();
    }else{
        $(document.body).removeClass("main");
    }



};
function bindEvent(){

    // 날짜지정 관련
    $("#btnDate").on("click",function(){
        $.ajax({
            url: "/main",
            dataType: "json",
            type: "post",
            data : "selectedDate=" + calendar.date.select,
            success:function(data){
                console.log("get schedule of selected date success!!");
                rows=data.rData;
                reservation.reset();
            },
            error: function(){console.log("get schedule of selected date success!!");}
        })
        //calendar.date.select
    });
    $("#txtDate").on("click", function(){
        if(calendar.isExist()){
            calendar.show();
        }else{
            calendar.init();
        }

    } );

}




var reservation = {
    data : {

        // DB data binding
    },
    init : function(){
        $(".reservation td > a").on("click",function(){reservation.movePage($(this));});
        reservation.select();
        if($(document.body).hasClass('main')) {
            if (rows.length != 0) {
                reservation.drawReservation();
            }
        }

    },
    reset: function(){
        $(".reserved-mine").each(function(){
            $(this).removeClass("reserved-mine");
        });
        $(".reserved-other").each(function(){
            $(this).removeClass("reserved-other");
        });
        if(rows.length!=0){
            reservation.drawReservation();
        }

    },
    select : function(){
        console.log("select!!! client");
        $.ajax({
            url: "/main",
            dataType: "json",
            type: "post",
            //data : param,
            success:function(){console.log("reservation success!!");},
            error: function(){console.log("reservation fail!!");}
        })
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

    },
    drawReservation : function(){
        console.log("draw reservation");
        var $timeCells;
        for( var i = 0 ; i < rows.length ;i++){
            var row = rows[i];
            var roomClass = getRoomClassId(row.ROOM_ID);
            var userID = row.USER_ID;
            $timeCells = $("."+roomClass).siblings();
            var fromTimeIndex = getReservedTimeIndex(row.FROM_TIME);
            var toTimeIndex = getReservedTimeIndex(row.TO_TIME);
            for( var j = fromTimeIndex; j < toTimeIndex ; j++){
                var $timecell = $timeCells.eq(j);
                if(userID==userInfo.userid){
                    $timecell.addClass('reserved-mine');
                }else{
                    $timecell.addClass('reserved-other');
                }

            }


        }
    }
}
function getRoomClassId(roomid){
    var roomClass = ['room01','room02','room03','room04' ];
    switch(roomid){
        case 'BLACK':
            return roomClass[0];
        case 'YELLOW':
            return roomClass[1];
        case 'BLUE':
            return roomClass[2];
        case 'ORANGE':
            return roomClass[3];

    }
};
function getReservedTimeIndex(time){
    var hour =  parseInt(time.substr(0,2));
    var min = parseInt(time.substr(2,4)) ;

    return (hour-9)*2 + (( min == 00) ? 0 : 1);
};

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
        this.resetData();
    },
    update : function(){
        user.getData();

        if(!user.checkValue()) return;

        var param = "userId=" + user.data.newPassword1 +
                    "&org_password=" + user.data.oldPassword +
                    "&new_password=" + user.data.newPassword1 +
                    "&new_username=" + user.data.username ;

        $.ajax({
            url: "/users",
            dataType: "json",
            type: "post",
            data : param,
            success:function(){console.log("user update success!!");},
            error: function(){console.log("user update fail!!");}
        })
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
    isExist:function(){
        if($('#calendar').children().length==0){
            return false;
        }else{
            return true;
        }
    },
    show:function(){
        $('#calendar').show();
    },
    setDayToCalendar:function(date) {

        var clndrInstanse = $('#calendar').clndr();
        var eventArray = [
            {
                date: date, // year+'-'+month+'-'+day'
                title: 'Selected'
            }
        ];
        clndrInstanse.setEvents(eventArray);
    },
    init : function(){
        var cal = $('#calendar');

        //calendar.setCurrentDate();

        cal.clndr({
            template: $('#calendar-template').html(),
            daysOfTheWeek: ['일', '월', '화', '수', '목', '금', '토'],
            events: [
                { date: getToDay() }
            ],
            clickEvents: {
                click: function(target) {
                    calendar.date.select = target.date._i;
                    $("#txtDate").val(calendar.date.select);
                    calendar.setDayToCalendar(calendar.date.select);

                    cal.hide();
                }
            }
        });
    }
};

function getToDay(){
    var date = new Date();
    var today = date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString();
    return today;
};

var common = {
    isEmpty : function(val){
        return (typeof val === "undefined" || val === undefined || val === "")? true : false;
    }
};

function decodeSession(){
    var sessionStr = $('#hssession').val();
    var data = JSON.parse(decodeURIComponent( sessionStr ));
    return data;
};