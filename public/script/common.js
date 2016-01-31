/*
    <body> load시 실행
 */
function init(){
    // init reservation page
    if($(".login_wrapper").length === 0){
        // add background Image
        $(document.body).addClass("main");

        // init revervation object
        reservation.init();
        user.init();
        logout.bindEvent();

        $("#btnDate").on("click", calendar.changeDate());
        $("#txtDate").on("click", function(){
           if(calendar.isExist()){
               calendar.show();
           }else{
               calendar.init();
           }
        });

    // init login page
    }else{
        // remove background Image
        $(document.body).removeClass("main");

        // pressed enter key
        $(document).keypress(function(e) {
            if(e.which == 13) {
                checklogin();
            }
        });
    }
};

/*
    logout
 */
var logout = {
    bindEvent : function(){
        $("#btnLogout").on("click", function(){
            user.info = {};
            reservation.data = {};
            window.location = "/";
        });
    }
}


var reservation = {
    data : {},
    init : function(){
        this.bindEvent();
        if (this.data.length != 0) {
            reservation.draw();
        }
    },
    bindEvent : function(){
        // Display [회의룸 예약 등록] page
        $(".reservation td > a").on("click",function(){
            reservation.make($(this));
        });
        // [회의룸 예약 등록] page - [등록] button
        $("#btnRegistReservation").on("click", reservation.insert);
        // [회의룸 예약 등록] page - [닫기] button
        $("#btnCloseReservation").on("click",function(){
            $("#registReservation").hide();
            $("#registName").val("");
            $("#registPhone").val("");
            $("#mask").hide();
        });

        // [회의룸 예약 수정] page - [예약수정] button
        $("#btnModifyReservation").on('click',function(){
            var mtId = $("#mtId").val();
            reservation.modifyDetail(mtId);
            $("#modifyReservation").hide();
        });
        // [회의룸 예약 수정] page - [예약취소] button
        $("#btnDeleteReservation").on("click",function(){
            var mtId = $("#mtId").val();
            var answer = confirm("회의룸 예약을 취소하시겠습니까?");
            if(answer){
                for(var i = 0 ; i< reservation.data.length;i++){
                    if(reservation.data[i].ID==mtId){
                        //remove rows data
                    }
                }
                $.ajax({
                    url: "/manageMeeting",
                    dataType: "json",
                    type: "post",
                    data : {"mtId":mtId, "action":"cancelMt"},
                    success:function(data){
                        $("#modifyReservation").hide();
                        reservation.refresh();
                    },
                    error: function(status,data){
                        $("#modifyReservation").hide();
                        alert("예약을 취소하지 못했습니다. ");
                    }
                })
            }
        });

        // [회의룸 예약 수정] page - [닫기] button
        $("#btnOkReservation").on("click",function(){
            $("#registName").val("");
            $("#registPhone").val("");
            $("#modifyReservation").hide();
        })
    },
    reset: function(){
        $(".reserved-mine").each(function(){
            $(this).removeClass("reserved-mine");
            $(this).children('a').off('click').on("click",function(){
                reservation.make($(this));
            });
        });
        $(".reserved-other").each(function(){
            $(this).removeClass("reserved-other");
            $(this).children('a').off('click').on("click",function(){
                reservation.make($(this));
            });
        });
        if(this.data.length!=0){
            reservation.draw();
        }

    },
    insert : function(){
        var room = $("#registRoom").text(), // 회의실
            date = $("#registDate").text(), // 회의일자
            fromTime = $("#registFromTime").text().replace(' ~ ', '').replace(':',''),  // 회의시간 from
            toTime = $("#registToTime option:selected").text().replace(':', ''),        // 회의시간 to
            userName = $("#registUserName").text(), // 예약팀
            registName = $("#registName").val(),    // 예약자
            phone = $("#registPhone").val(),        // 내선번호

            param = "day=" + date +
                    "&fromtime=" + fromTime +
                    "&totime=" + toTime +
                    "&roomid=" + room +
                    "&userid=" + user.info.userid +
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
                    // hide [회의실 예약 등록] page
                    $("#registReservation").hide();
                    $("#mask").hide();

                    reservation.refresh();
                    $("#registName").val("");   // [예약자] reset
                    $("#registPhone").val("");  // [내선번호] reset

                },
                error: function (err) {
                    if(err.responseJSON.fail=="101"){
                        user.info={};
                        reservation.data = {};
                        window.location = "/";
                        alert("서버와의 통신이 끊어졌습니다. 다시 로그인해주십시오.");
                    }else{
                        alert("같은 시간대에 다른 예약이 있습니다. 다른 시간을 선택하여 주십시오.");
                        reservation.refresh();
                        $("#registName").val("");   //  [예약자] reset
                        $("#registPhone").val("");  //  [내선번호] reset
                        $("#registReservation").hide();
                        $("#mask").hide();
                    }
                }
            })
        }

    },
    movePage : function(obj,$popup){
        var that = obj, _offset = that.offset();
        $popup.css({top : _offset.top + 8, left : _offset.left + 8}).show();

    },
    draw : function(){
        var $timeCells, $timeCell;
        for( var i = 0 ; i < this.data.length ;i++){
            var row = this.data[i],
                roomClass = room.getClassId(row.ROOM_ID),
                userID = row.USER_ID,
                fromTimeIndex = this.getTimeIndex(row.FROM_TIME),
                toTimeIndex = this.getTimeIndex(row.TO_TIME);

            $timeCells = $("."+roomClass).siblings();

            for( var j = fromTimeIndex; j < toTimeIndex ; j++){
                $timeCell = $timeCells.eq(j);

                if(userID==user.info.userid){
                    $timeCell.addClass('reserved-mine');
                    $timeCell.children('a').off('click').on('click',function(){
                        reservation.modify($(this).parent());
                    });
                }else{
                    $timeCell.addClass('reserved-other');
                    $timeCell.children('a').off('click').on('click',function(){
                        reservation.display($(this).parent());
                    });
                }
            }
        }
    },
    make : function($timecell){
        var parentNode = $timecell.parents('td');   // div.reservation table tr > td > a
        var roomId = room.getId(parentNode);        // [BLACK, YELLOW, BLUE, ORANGE]
        var timeId = parentNode.index()-1;          // 0
        var fromTimeStr = time.getString(timeId);   // 0900
        var toTimeId = time.check(parentNode);      // {'1':'09:00', .. ,'24' : '20:30'}
        var strOption = '';

        var fromTimeInt = parseInt(fromTimeStr);    // 900

        // 회의종료 시간 select list에 표시시
       if( (timeId+1) ==  toTimeId){
            strOption = "<option selected>" +time.getString(toTimeId,true) + "</option>";
        }else{
            for(var i = timeId+1 ; i < toTimeId+1 ; i++){
                strOption += "<option>" + time.getString(i,true) + "</option>";
            }
        }

        // 유저가 선택한 날짜가 없으면
        if($("#txtDate").val().length==0){
            // 오늘 날짜
            date=common.getToDay();
        }else{
            // 유저 선택 날짜
            date=$("#txtDate").val();
        }

        $("#registRoom").text(roomId);  // 회의실
        $("#registDate").text(date);    // 회의일자
        $("#registFromTime").text(fromTimeStr.substr(0,2)+":"+fromTimeStr.substr(2,4) + " ~ "); // 회의시작시간
        $("#registToTime").children().remove(); // 회의 끝나는 시간 select List reset
        $("#registToTime").append(strOption);   // 회의 끝나는 시간 node 붙이기
        $("#registToTime option:eq(0)").attr("selected", "selected");   // select List 첫번째 요소 선택상태

        $("#modifyNoticeMsg").hide();
        $("#registToTime").show();
        $("#btnRegistReservation").off("click").on("click", reservation.insert);

        $("#registReservation").show();
        $("#mask").show();
    },
    modify : function($timecell){
        var $popup = $("#modifyReservation");

        $("#btnModifyReservation").show();  // [예약수정]  button
        $("#btnDeleteReservation").show();  // [예약취소] button

        var reserveData = rowData.get($timecell);
        $("#reserved-room").text(reserveData.ROOMNAME);     // [회의실] : black
        $("#reserved-day").text(reserveData.MT_DATE);       // [회의일자] : 2016-01-31
        $("#meeting-time").text(time.displayString(reserveData.FROM_TIME , reserveData.TO_TIME)); // [회의시간] : 12:30 ~ 13:00
        $("#reserved-time").text(reserveData.INSERT_DATE);  // [예약일시] : 2016-01-31 05:21:28 AM
        $("#reserved-team").text(reserveData.USERNAME);     // [예약팀] : 테스터
        $("#reserved-person-phone").text(reserveData.NAME +" (내선번호 : "+reserveData.PHONE+")"); // [예약자] : 테스터(내선번호 : 111)
        $("#mtId").val(reserveData.ID);

        reservation.movePage($timecell, $popup);
    },
    display : function($timecell){
        var $popup = $("#modifyReservation");
        $("#btnModifyReservation").hide();
        $("#btnDeleteReservation").hide();

        var reserveData = rowData.get($timecell);

        $("#reserved-room").text(reserveData.ROOMNAME);
        $("#reserved-day").text(reserveData.MT_DATE);
        $("#meeting-time").text(time.displayString(reserveData.FROM_TIME , reserveData.TO_TIME)); // xx:xx ~ xx: xx 로 고칠것
        $("#reserved-time").text(reserveData.INSERT_DATE);
        $("#reserved-team").text(reserveData.USERNAME); // 쿼리 변경 후 user name으로 할 것
        $("#reserved-person-phone").text(reserveData.NAME +" (내선번호 : "+reserveData.PHONE+")");
        $("#mtId").val(reserveData.ID);

        reservation.movePage($timecell, $popup);
    },
    modifyDetail: function(mtId){
        var data = rowData.getById(mtId);
        $("#registReservation").show();
        $("#mask").show();

        $("#registRoom").text(data.ROOMNAME);       // [회의실]
        $("#registDate").text(data.MT_DATE);        // [회의일자]
        $("#registFromTime").text(time.displayString(data.FROM_TIME,data.TO_TIME)); // [회의시간] 시작 ~ 끝
        $("#modifyNoticeMsg").show().text("회의 시간을 수정하시려면 예약 취소후 다시 등록하여 주시기 바랍니다.");
        $("#registToTime").hide();                  // [회의시간] 끝 숨김
        $("#registUserName").text(data.USERNAME);   // [예약팀]
        $("#registName").val(data.NAME);            // [예약자]
        $("#registPhone").val(data.PHONE);          // [예약팀]

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
                        $("#registReservation").hide();
                        $("#mask").hide();

                        $("#registName").val("");
                        $("#registPhone").val("");

                        reservation.refresh();
                    },
                    error: function(status,data){
                        $("#registReservation").hide();
                        $("#mask").hide();

                        $("#registName").val("");
                        $("#registPhone").val("");

                        reservation.refresh();
                    }
                })
            }

        });
    },
    refresh : function(){
        var date = $("#txtDate").val();
        if(date.length==0){
            date = common.getToDay();
        }
        $.ajax({
            url: "/main",
            dataType: "json",
            type: "post",
            data:{"date":date},
            success:function(data){
                reservation.data=data.rData;
                reservation.reset();
                reservation.draw();
            },
            error: function(){
                reservation.reset();
                reservation.draw();
            }
        })

    },
    getTimeIndex : function(time){
        var hour =  parseInt(time.substr(0,2));
        var min = parseInt(time.substr(2,4)) ;

        return (hour-9)*2 + (( min == 00) ? 0 : 1);
    }
};

var rowData = {
    get : function($timecell){
        var timeIndex = $timecell.index()-1 ;           // 8, {'1':'09:00', .. ,'24' : '20:30'}
        var fromTimeString = time.getString(timeIndex); // 1300
        var roomId = room.getId($timecell);             // BLACK
        for(var i= 0 ; i < reservation.data.length ; i++){
            if(roomId==reservation.data[i].ROOM_ID ){
                var fromTimeInt = parseInt(fromTimeString); // 1300

                // $timecell의 timeIndex보다 fromTime과 toTime이 작은경우
                if(fromTimeString==reservation.data[i].FROM_TIME || ( parseInt(reservation.data[i].FROM_TIME) <= fromTimeInt && fromTimeInt < parseInt(reservation.data[i].TO_TIME)) ){
                    return reservation.data[i];
                }
            }
        };
    },
    getById : function(mtId){
        for(var i= 0 ; i < reservation.data.length ; i++){
            if(mtId==reservation.data[i].ID ){
                return reservation.data[i];
            }
        };
    }
};
var time = {
    getString : function(timeIndex, flag){
        var str, isEven=false;
        if(timeIndex%2==0) isEven=true;

        if(flag){
            // 09:00 || 09:30
            str = Math.floor((timeIndex/2+9)).toString() +":"+ ((isEven)? '00' : '30' );
        }else{
            // 0900 || 0930
            str = Math.floor((timeIndex/2+9)).toString() + ((isEven)? '00' : '30' );
        }

        // 9:00 || 900 || 9:30 || 930
        (str.length==3) ? str= '0'+str : str;

        return str;
    },
    displayString : function(fromTime, toTime){
        return fromTime.substring(0,2)+":"+fromTime.substring(2,4)+" ~ "+ toTime.substring(0,2)+":"+toTime.substring(2,4);
    },
    check : function($timecell){
        var toTimeId,                   // {'1':'09:00', .. ,'24' : '20:30'}
            $tmpNode=$timecell.next();  // td > a

        if($tmpNode.length==0) return 24;

        while($tmpNode.length!=0){
            // reserved
            if($tmpNode.hasClass("reserved-mine") || $tmpNode.hasClass("reserved-other")  ){
                toTimeId =  $tmpNode.index()-1;
                break;
            // didn't reserve
            }else if($tmpNode.index()==24){
                toTimeId = 24;
                break;

            }else{
                $tmpNode = $tmpNode.next();
            }
        }
        return toTimeId;
    }
};
var room = {
  getId : function($timecell){
      return $timecell.siblings().first().text();
  },
  getClassId : function(roomId){
      var roomClass = ['room01','room02','room03','room04' ];
      switch(roomId){
          case 'BLACK':
              return roomClass[0];
          case 'YELLOW':
              return roomClass[1];
          case 'BLUE':
              return roomClass[2];
          case 'ORANGE':
              return roomClass[3];
      }
  }
};

var user = {
    data : {},
    info : {},
    init : function(){

        // check session value
        if(this.info.username==null) {
            alert("다시 로그인 해주십시오.");
            window.location = "/";
        }
        this.bindEvent();

    },
    bindEvent : function(){
        // [정보변경] link
        $("#btnUser").on("click", this.display);

        // [등록] button
        $("#btnConfirmUser").on("click", this.update);

        // [닫기] button
        $("#btnOkUser").on("click", this.hide);
    },
    display : function(){
        // show mask
        $("#mask").show();

        // show modifyUser page
        $("#modifyUser").show();
    },
    hide : function(){
        // hide modifyUser page
        $("#modifyUser").hide();

        // hide mask
        $("#mask").hide();

        // reset modifyuser Page and Data
        user.resetData();
    },
    update : function(){

        // get input password
        user.getData();

        // check input password
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
            success:function(){
                console.log("user update success!!");

                // hide modifyUser page
                $("#modifyUser").hide();
                $("#mask").hide();
                $("#user_errMsg").text("");

                // reset session info
                user.info = {};
                reservation.data = {};

                // move login page
                window.location = "/";

                alert("비밀번호가 변경되었습니다. 다시 로그인해주십시오.");
            },
            error: function(){
                // show error Msg
                $("#user_errMsg").text("[기존 비밀번호]가 잘못되었습니다. 다시 입력해주십시오.");

            }
        })
    },
    getData : function(){
        // [기존 비밀번호]
        this.data.oldPassword = $("#old_password").val();
        // [신규 비밀번호]
        this.data.newPassword1 = $("#new_password1").val();
        // [비밀번호 확인]
        this.data.newPassword2 = $("#new_password2").val();
        // [팀명]
        this.data.username = $("#new_username").val();
    },
    resetData :function(){
        // reset Data
        this.data.oldPassword = '';
        this.data.newPassword1 = '';
        this.data.newPassword2 = '';

        // reset page
        $("#old_password").val(this.data.oldPassword);
        $("#new_password1").val(this.data.newPassword1);
        $("#new_password2").val(this.data.newPassword2);

        $("#new_username").val(user.info.username);

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
};

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
    changeDate : function(){
        if($("#txtDate").val().length==0) return;

        $.ajax({
            url: "/main",
            dataType: "json",
            type: "post",
            data : "selectedDate=" + calendar.date.select,
            success:function(data){
                console.log("get schedule of selected date success!!");
                reservation.data=data.rData;
                reservation.reset();
            },
            error: function(){console.log("get schedule of selected date success!!");}
        })
    },
    init : function(){
        var cal = $('#calendar');
        cal.clndr({
            template: $('#calendar-template').html(),
            daysOfTheWeek: ['일', '월', '화', '수', '목', '금', '토'],
            events: [
                { date: common.getToDay() }
            ],
            clickEvents: {
                click: function(target) {
                    calendar.date.select = target.date._i;
                    $("#txtDate").val(calendar.date.select);
                    calendar.setDayToCalendar(calendar.date.select);
                    calendar.changeDate();

                    cal.hide();
                }
            }
        });

        this.bindEvent();
    },
    bindEvent : function(){
        $("#btnDate").on("click",calendar.changeDate);
        $("#txtDate").on("click", function(){
            if(calendar.isExist()){
                calendar.show();
            }else{
                calendar.init();
            }
        } );
    }
};

var common = {
    isEmpty : function(val){
        return (typeof val === "undefined" || val === undefined || val === "")? true : false;
    },
    getToDay :function(){
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = ((date.getMonth()+1)) < 10 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString() ;
        var day = (date.getDate() <10 ) ?  "0"+date.getDate().toString() : date.getDate().toString();
        var today = year+"-"+month+"-"+day;
        return today;
    }
};
