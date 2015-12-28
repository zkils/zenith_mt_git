function init(){
    if($(".login_wrapper").length === 0) $(document.body).addClass("main");
    else $(document.body).removeClass("main");

    $(".reservation td > a").on("click",function(){reservation.movePage($(this));});
    $("#btnUser").on("click", user.display);
    //calendar.init();
    $("#txtDate").on("click", calendar.init);
};




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
    display : function(){
        $("#mask").show();
        $("#modifyUser").show();
    }
}
var calendar = {
    init : function(){

        $('#calendar').clndr({
            template: $('#calendar-template').html(),
            events: [
                { date: '2015-12-28' }
            ],
            clickEvents: {
                click: function(target) {
                    console.log(target);
                }
            }
        });
    }
}