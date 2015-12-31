function init(){
    if($(".login_wrapper").length === 0){
        $(document.body).addClass("main");
        reservation.init();
        user.init();
        bindEvent();
    }else{
        $(document.body).removeClass("main");
        $(document).keypress(function(e) {
            if(e.which == 13) {
                checklogin();
            }
        });

    }



};
function bindEvent(){

    // 날짜지정 관련
    $("#btnDate").on("click",function(){
        if($("#txtDate").val().length==0) return;

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
    $("#btnDeleteReservation").on("click",function(){
        var mtId = $("#mtId").val();
        var answer = confirm("회의룸 예약을 취소하시겠습니까?");
        if(answer){
            for(var i = 0 ; i< rows.length;i++){
                if(rows[i].ID==mtId){
                    //remove rows data
                }
            }
                $.ajax({
                    url: "/manageMeeting",
                    dataType: "json",
                    type: "post",
                    data : {"mtId":mtId, "action":"cancelMt"},
                    success:function(data){
                        $("#modifyReservation").hide(); //TO-DO error..
                        reservation.refreshReservationData();
                    },
                    error: function(status,data){
                        $("#modifyReservation").hide();
                        console.log("fail cancel reservation");
                        alert("예약을 취소하지 못했습니다. ");
                    }
                })
        }


    });

    $("#btnModifyReservation").on('click',function(){
        var mtId = $("#mtId").val();
        reservation.showModifyReservationDetail(mtId);
        $("#modifyReservation").hide();
    });


    $("#btnLogout").on("click", function(){
        userInfo = null;
        rows = null;
        window.location = "/";
    });
    $("#btnCloseReservation").on("click",function(){
        $("#registReservation").hide();
        $("#mask").hide();
    })
}




var reservation = {
    data : {
        ROOM : {
            BLACK : {id : "rm01",
                time : [
                    {FROM :"09:00", isReservation : false},
                    {FROM :"09:30", isReservation : false},
                    {FROM :"10:00", isReservation : false},
                    {FROM :"10:30", isReservation : false},
                    {FROM :"11:00", isReservation : false},
                    {FROM :"11:30", isReservation : false},
                    {FROM :"12:00", isReservation : false},
                    {FROM :"12:30", isReservation : false},
                    {FROM :"13:00", isReservation : false},
                    {FROM :"13:30", isReservation : false},
                    {FROM :"14:00", isReservation : false},
                    {FROM :"14:30", isReservation : false},
                    {FROM :"15:00", isReservation : false},
                    {FROM :"15:30", isReservation : false},
                    {FROM :"16:00", isReservation : false},
                    {FROM :"16:30", isReservation : false},
                    {FROM :"17:00", isReservation : false},
                    {FROM :"17:30", isReservation : false},
                    {FROM :"18:00", isReservation : false},
                    {FROM :"18:30", isReservation : false},
                    {FROM :"19:00", isReservation : false},
                    {FROM :"19:30", isReservation : false},
                    {FROM :"20:00", isReservation : false},
                    {FROM :"20:30", isReservation : false}
                ]
            },
            YELLOW : {id : "rm02",
                time : [
                    {FROM :"09:00", isReservation : false},
                    {FROM :"09:30", isReservation : false},
                    {FROM :"10:00", isReservation : false},
                    {FROM :"10:30", isReservation : false},
                    {FROM :"11:00", isReservation : false},
                    {FROM :"11:30", isReservation : false},
                    {FROM :"12:00", isReservation : false},
                    {FROM :"12:30", isReservation : false},
                    {FROM :"13:00", isReservation : false},
                    {FROM :"13:30", isReservation : false},
                    {FROM :"14:00", isReservation : false},
                    {FROM :"14:30", isReservation : false},
                    {FROM :"15:00", isReservation : false},
                    {FROM :"15:30", isReservation : false},
                    {FROM :"16:00", isReservation : false},
                    {FROM :"16:30", isReservation : false},
                    {FROM :"17:00", isReservation : false},
                    {FROM :"17:30", isReservation : false},
                    {FROM :"18:00", isReservation : false},
                    {FROM :"18:30", isReservation : false},
                    {FROM :"19:00", isReservation : false},
                    {FROM :"19:30", isReservation : false},
                    {FROM :"20:00", isReservation : false},
                    {FROM :"20:30", isReservation : false}
                ]
            },
            BLUE : {id : "rm03",
                time : [
                    {FROM :"09:00", isReservation : false},
                    {FROM :"09:30", isReservation : false},
                    {FROM :"10:00", isReservation : false},
                    {FROM :"10:30", isReservation : false},
                    {FROM :"11:00", isReservation : false},
                    {FROM :"11:30", isReservation : false},
                    {FROM :"12:00", isReservation : false},
                    {FROM :"12:30", isReservation : false},
                    {FROM :"13:00", isReservation : false},
                    {FROM :"13:30", isReservation : false},
                    {FROM :"14:00", isReservation : false},
                    {FROM :"14:30", isReservation : false},
                    {FROM :"15:00", isReservation : false},
                    {FROM :"15:30", isReservation : false},
                    {FROM :"16:00", isReservation : false},
                    {FROM :"16:30", isReservation : false},
                    {FROM :"17:00", isReservation : false},
                    {FROM :"17:30", isReservation : false},
                    {FROM :"18:00", isReservation : false},
                    {FROM :"18:30", isReservation : false},
                    {FROM :"19:00", isReservation : false},
                    {FROM :"19:30", isReservation : false},
                    {FROM :"20:00", isReservation : false},
                    {FROM :"20:30", isReservation : false}
                ]
            },
            ORANGE : {id : "rm04",
                time : [
                    {FROM :"09:00", isReservation : false},
                    {FROM :"09:30", isReservation : false},
                    {FROM :"10:00", isReservation : false},
                    {FROM :"10:30", isReservation : false},
                    {FROM :"11:00", isReservation : false},
                    {FROM :"11:30", isReservation : false},
                    {FROM :"12:00", isReservation : false},
                    {FROM :"12:30", isReservation : false},
                    {FROM :"13:00", isReservation : false},
                    {FROM :"13:30", isReservation : false},
                    {FROM :"14:00", isReservation : false},
                    {FROM :"14:30", isReservation : false},
                    {FROM :"15:00", isReservation : false},
                    {FROM :"15:30", isReservation : false},
                    {FROM :"16:00", isReservation : false},
                    {FROM :"16:30", isReservation : false},
                    {FROM :"17:00", isReservation : false},
                    {FROM :"17:30", isReservation : false},
                    {FROM :"18:00", isReservation : false},
                    {FROM :"18:30", isReservation : false},
                    {FROM :"19:00", isReservation : false},
                    {FROM :"19:30", isReservation : false},
                    {FROM :"20:00", isReservation : false},
                    {FROM :"20:30", isReservation : false}
                ]
            }
        },
        binding : function(){
            var time, from;
            for(var i = 0; i < rows.length ; i++){
                time = this.ROOM[rows[i].ROOM_ID].time;

                for(var j = 0; j < time.length; j++){
                    from = time[j].FROM.replace(":", "");

                    if(from == rows[i].FROM_TIME) {
                        while (time[j].FROM.replace(":", "") !== rows[i].TO_TIME) {
                            time[j].isReservation = true;
                            j++;
                        }
                    }

                };

            }
        },
        reset : function(){
            for(var i in this.ROOM){
                for(var i in this.ROOM[i].time){
                    this.ROOM[i].time[j].isReservation = false;
                }
            }
        },
        getToTime : function(room,fromTimeId){
            var time = this.ROOM[room].time, result = [];
            for(var i = (fromTimeId + 1); i < time.length; i++){
                if(!time[i].isReservation){
                    result.push(time[i].FROM);
                }else{
                    break;
                }
            }
            return result;
        }
    },
    init : function(){
        this.data.binding();
        $(".reservation td > a").on("click",function(){
            reservation.makeReservation($(this));
            //reservation.movePage($(this));
        });
        $("#btnRegistReservation").on("click", reservation.insert);

        reservation.select();
        if (rows.length != 0) {
            reservation.drawReservation();
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
    insert : function(){
        var room = $("#registRoom").text(),
            date = $("#registDate").text(),
            fromTime = $("#registFromTime").text().replace(' ~ ', '').replace(':',''),
            toTime = $("#registToTime option:selected").text().replace(':', ''),
            userName = $("#registUserName").text(),
            registName = $("#registName").val(),
            phone = $("#registPhone").val(),
            param = "day=" + date +
                    "&fromtime=" + fromTime +
                    "&totime=" + toTime +
                    "&roomid=" + room +
                    "&userid=" + userInfo.userid +
                    "&name=" + registName +
                    "&number=" + phone +
                    "&action=insertMt";
        if($("#registName").val().length==0){
            alert("예약자를 입력해주세요");
        }else if($("#registPhone").val().length==0){
            alert("내선번호를 입력해주세요");
        }else {
            $.ajax({
                url: '/manageMeeting',
                dataType: "json",
                type: "post",
                data: param,
                success: function () {
                    console.log("success insert");
                },
                error: function () {
                    console.log("fail insert")
                }
            })
        }

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
        var parentNode = $timecell.parents('td');
            room = getRoomId(parentNode),
            timeId = parseInt(parentNode[0].className.match(/time../)[0].substr(-2)) - 1,
            fromTime = this.data.ROOM[room].time[timeId].FROM,
            toTime = this.data.getToTime(room, timeId),
            strOption = '';

            for(var i = 0; i < toTime.length; i++){
                if(i == 0){
                    strOption = "<option selected>" + toTime[i] + "</option>"
                }
                strOption += "<option>" + toTime[i] + "</option>"
            }


        $("#registRoom").text(room);
        $("#registDate").text(getToDay());
        $("#registFromTime").text(fromTime + " ~ ");
        $("#registToTime").append(strOption);


        $("#registReservation").show();
        $("#mask").show();
    },
    modifyReservation : function($timecell){
        var $popup = $("#modifyReservation");
        $("#btnModifyReservation").show();
        $("#btnDeleteReservation").show();

        var reserveData = getRowData($timecell);
        $("#reserved-room").text(reserveData.ROOMNAME);
        $("#reserved-day").text(reserveData.MT_DATE);
        $("#meeting-time").text(getDisplayTimeString(reserveData.FROM_TIME , reserveData.TO_TIME)); // xx:xx ~ xx: xx 로 고칠것
        $("#reserved-time").text(reserveData.INSERT_DATE);
        $("#reserved-team").text(reserveData.USERNAME); // 쿼리 변경 후 user name으로 할 것
        $("#reserved-person-phone").text(reserveData.NAME +" (내선번호 : "+reserveData.PHONE+")");
        $("#mtId").val(reserveData.ID);

        reservation.movePage($timecell, $popup);
    },
    showReservation : function($timecell){
        var $popup = $("#modifyReservation");
        $("#btnModifyReservation").hide();
        $("#btnDeleteReservation").hide();

        var reserveData = getRowData($timecell);
        $("#reserved-room").text(reserveData.ROOMNAME);
        $("#reserved-day").text(reserveData.MT_DATE);
        $("#meeting-time").text(getDisplayTimeString(reserveData.FROM_TIME , reserveData.TO_TIME)); // xx:xx ~ xx: xx 로 고칠것
        $("#reserved-time").text(reserveData.INSERT_DATE);
        $("#reserved-team").text(reserveData.USERNAME); // 쿼리 변경 후 user name으로 할 것
        $("#reserved-person-phone").text(reserveData.NAME +" (내선번호 : "+reserveData.PHONE+")");
        $("#mtId").val(reserveData.ID);

        reservation.movePage($timecell, $popup);
    },
    showModifyReservationDetail: function(mtId){
        var data = getRowDataById(mtId);
        $("#registReservation").show();
        $("#mask").show();

        $("#registRoom").text(data.ROOMNAME);
        $("#registDate").text(data.MT_DATE);
        $("#registFromTime").text(getDisplayTimeString(data.FROM_TIME,data.TO_TIME));
        $("#modifyNoticeMsg").show().text("회의 시간을 수정하시려면 예약 취소후 다시 등록하여 주시기 바랍니다.");
        $("#registToTime").hide();
        $("#registUserName").text(data.USERNAME);
        $("#registName").val(data.NAME);
        $("#registPhone").val(data.PHONE);

        $("#btnRegistReservation").off('click').on('click',function(){
            if($("#registName").val().length==0){
                alert("예약자를 입력해주세요");
            }else if($("#registPhone").val().length==0){
                alert("내선번호를 입력해주세요");
            }else{
                $.ajax({
                    url: "/manageMeeting",
                    dataType: "json",
                    type: "post",
                    data : {"mtId":mtId, "action":"updateMt", "name": $("#registName").val() , "phone": $("#registPhone").val()},
                    success:function(data){
                        $("#registReservation").hide(); //TO-DO error..
                    },
                    error: function(status,data){
                        $("#registReservation").hide();
                        console.log("fail cancel reservation");
                        //updateRowData($("#mtId").val());
                        reservation.refreshReservationData();
                        //reservation.reset();
                        //reservation.drawReservation();
                    }
                })
            }

        });
    },
    refreshReservationData : function(){
        var date = $("#txtDate").val();
        if(date.length==0){
            date = getToDay();
        }
        $.ajax({
            url: "/main",
            dataType: "json",
            type: "post",
            data:{"date":date},
            success:function(data){
                console.log("refresh success!!");
                rows=data.rData;
                reservation.reset();
                reservation.drawReservation();
            },
            error: function(rData){
                console.log("refresh fail!!");
                rows=data.rData;
                reservation.reset();
                reservation.drawReservation();
            }
        })

    }
};


function getRowDataById(mtId){
    for(var i= 0 ; i < rows.length ; i++){
        if(mtId==rows[i].ID ){
               return rows[i];
        }
    };
};

function getRowData($timecell){
    var timeIndex = $timecell.index()-1 ;
    var fromTimeString = getTimeString(timeIndex); // form date
    var roomId = getRoomId($timecell);
    for(var i= 0 ; i < rows.length ; i++){
      if(roomId==rows[i].ROOM_ID ){
          var fromTimeInt = parseInt(fromTimeString);
          if(fromTimeString==rows[i].FROM_TIME || ( parseInt(rows[i].FROM_TIME) <= fromTimeInt && fromTimeInt <= parseInt(rows[i].TO_TIME)) ){
              parseInt(fromTimeString)
              return rows[i];

          }
      }
    };
};

function deleteRowData(mtId){
    for(var i= 0 ; i < rows.length ; i++){
        if(mtId==rows[i].ID){
            rows.splice(i, 1);
            break;
        }
    };

};

function getRoomId($timecell){  //gkem
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

    str = Math.floor((timeIndex/2+9)).toString() + ((isEven)? '00' : '30' );
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
        user.resetData();
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
            error: function(){
                console.log("user update fail!!");
                $("#user_errMsg").text("[기존 비밀번호]가 잘못되었습니다. 다시 입력해주십시오.");

            }
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

        $("#new_username").val(userInfo.username);

        $("#user_errMsg").text("");

    },
    checkValue : function(){
        var msg = '';
        if(common.isEmpty(this.data.oldPassword)){
            msg = '[기존 비밀번호]를 입력하여 주십시오.';
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