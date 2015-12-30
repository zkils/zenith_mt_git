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
    $("#btnOkReservation").on("click",function(){
        $("#modifyReservation").hide();
    })
}




var reservation = {
    data : {

        // DB data binding
    },
    init : function(){
        $(".reservation td > a").on("click",function(){
            reservation.makeReservation($(this));
            //reservation.movePage($(this));
        });
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
            $(this).children('a').off('click').on("click",function(){
                reservation.makeReservation($(this).parent());
                //reservation.movePage($(this));
            });
        });
        $(".reserved-other").each(function(){
            $(this).removeClass("reserved-other");
            $(this).children('a').off('click').on("click",function(){
                reservation.makeReservation($(this).parent());
                //reservation.movePage($(this));
            });
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
    movePage : function(obj,$popup){
        var that = obj, _offset = that.offset();
        console.log(that.offset());

        //To-do 화면 크기와 항목 위치에 따라 포지션 변경되어야 함

        // open registReservation
        //$("#mask").show();
        //$("#registReservation").show();

        // open modifyReservation
        //$("#btnModify").hide();
        //$("#btnDelete").hide();
        $popup.css({top : _offset.top + 8, left : _offset.left + 8}).show();

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
                    $timecell.children('a').off('click').on('click',function(){
                        reservation.modifyReservation($(this).parent());
                    });
                }else{
                    $timecell.addClass('reserved-other')
                    $timecell.children('a').off('click').on('click',function(){
                        reservation.showReservation($(this).parent());
                    });
                }

            }


        }
    },
    makeReservation : function($timecell){
        var $popup = $("#registReservation");
        $popup.show();
        $mask.show();

    },
    modifyReservation : function($timecell){
        var $popup = $("#modifyReservation");
        $("#btnModifyReservation").show();
        $("#btnDeleteReservation").show();

        reservation.movePage($timecell, $popup);
    },
    showReservation : function($timecell){
        var $popup = $("#modifyReservation");
        $("#btnModifyReservation").hide();
        $("#btnDeleteReservation").hide();

        getRowData($timecell);

        reservation.movePage($timecell, $popup);
    }
};

function getRowData($timecell){
    var timeIndex = $timecell.index();
    var fromTimeString = getTimeString(timeIndex); // form date
    var roomId = getRoomId($timecell);
    for(var i= 0 ; i < rows.length ; i++){
      if(roomId==rows[i].ROOM_ID && fromTimeString==rows[i].FROM_TIME){
          console.log("----reservation date matched----");
          var reserveData = rows[i];
          $("#reserved-room").text(reserveData.ROOMNAME);
          $("#reserved-day").text(reserveData.MT_DATE);
          $("#meeting-time").text(getDisplayTimeString(reserveData.FROM_TIME , reserveData.TO_TIME)); // xx:xx ~ xx: xx 로 고칠것
          $("#reserved-time").text(reserveData.INSERT_DATE);
          $("#reserved-team").text(reserveData.USERNAME); // 쿼리 변경 후 user name으로 할 것
          $("#reserved-person-phone").text(reserveData.NAME +" (내선번호 : "+reserveData.PHONE+")");
          break;
      }
    };

};

function getRoomId($timecell){
    return $timecell.siblings().first().text();

    //var index = $timecell.parnet().index();
    //switch(index){
    //    case 0:
    //        return "BLACK";
    //        break;
    //    case 1:
    //        return "YELLOW";
    //        break;
    //    case 2:
    //        return "BLUE";
    //        break;
    //    case 3:
    //        return "ORANGE";
    //        break;
    //
    //}

};

function getTimeString(timeIndex){
    var str,isEven=false;
    if(timeIndex%2==0) isEven=true;

    str = Math.floor((timeIndex/2+9)).toString() + ((isEven)? '30' : '00' );
    (str.length==3) ? str= '0'+str : str;

    return str;
};

function getDisplayTimeString(fromTime,toTime){
    return fromTime.substring(0,2)+":"+fromTime.substring(2,4)+" ~ "+ toTime.substring(0,2)+":"+toTime.substring(2,4);

};

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