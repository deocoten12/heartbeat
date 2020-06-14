var socket = io("https://donhiptim.herokuapp.com/")
var page;
var itemPerPage = 15;
var id_arr=[];
var time_arr=[];
var beat_arr=[];
var oxy_arr=[];
var begin_page;
 var audio = new Audio('canhbao.mp3');
  audio.loop = true;
socket.on("send-full", function(data){
    $("#table-left1").html("")
    $("#table-center").html("")
    $("#table-right").html("")
    $("#table-left2").html("")
    data.forEach(function(item){
         id_arr.push(item.id)
         time_arr.push(item.time)
         beat_arr.push(item.beat)
         oxy_arr.push(item.oxy)
    }) 
    begin_page=Math.floor(id_arr.length/itemPerPage);
    page=begin_page;
    $("#current").html("");
    $("#current").append("<div class='page'</div>"+(begin_page+1)+"/"+(begin_page+1));
    for(let i = begin_page*itemPerPage; i < id_arr.length ; i++)
    {       
        $("#table-left1").append("<div class='para'>"+time_arr[i]+"</div>")
        $("#table-center").append("<div class='para'>"+beat_arr[i]+"</div>")
        $("#table-right").append("<div class='para'>"+oxy_arr[i]+"</div>")
        $("#table-left2").append("<div class='para'>"+id_arr[i]+"</div>")
    }
     if(page==begin_page){
        $("#page-back").hide();
        $("#ve-trang-dau").hide();
     }
     if(page==begin_page && page ==0){
        $("#page-back").hide();
        $("#page-next").hide();
     }
});
socket.on("server-update-data", function(data){

    // $("#current-beat").html("")
    // $("#current-oxy").html("")
    // $("#current-beat").append("Nhiệt độ: "+data.beat+"°C")
    // $("#current-oxy").append("Độ ẩm :"+data.oxy+" %")
    

  //   var v = data.beat;
  //   $('.beat-stem-perct').css('height',2*v+'%');
  // if(v<=10){
  //    $('.beat-stem-perct').css('background','#A9F5F2');
  //    $('.bulb').css('background','#A9F5F2');
  // }
  // else if(v<=20){
  //    $('.beat-stem-perct').css('background','#A9F5A9');
  //    $('.bulb').css('background','#A9F5A9');
  // }
  // else if(v<=30){
  //    $('.beat-stem-perct').css('background','#F3F781');
  //    $('.bulb').css('background','#F3F781');
  // }
  // else if(v<=40){
  //    $('.beat-stem-perct').css('background','#FE9A2E');
  //    $('.bulb').css('background','#FE9A2E');
  // }
  // else{
  //   $('.beat-stem-perct').css('background','#FE2E2E');
  //   $('.bulb').css('background','#FE2E2E');
  // }


  // var u = data.oxy;
  //   $('.oxy-stem-perct').css('height',u+'%');
  // if(u<=20){
  //    $('.oxy-stem-perct').css('background','#00FFFF');
  // }
  // else if(u<=40){
  //    $('.oxy-stem-perct').css('background','#00BFFF');
  // }
  // else if(u<=60){
  //    $('.oxy-stem-perct').css('background','#0080FF');
  // }
  // else if(u<=80){
  //    $('.oxy-stem-perct').css('background','#0040FF');
  // }
  // else{
  //   $('.oxy-stem-perct').css('background','#08088A');
  // }


    id_arr.push(data.id);
    time_arr.push(data.time);
    beat_arr.push(data.beat);
    oxy_arr.push(data.oxy);
    updateTable();
    if(id_arr.length==(begin_page+1)*itemPerPage){
        begin_page=begin_page+1;
         $("#current").html("");
        $("#current").append("<div class='page'</div>"+(page+1)+"/"+(begin_page+1));
        $("#page-back").show();
        $("#ve-trang-dau").show();
    }

})

function updateTable() {
    if(id_arr.length < (begin_page+1)*itemPerPage+1 && page==begin_page){
        $("#table-left1").append("<div class='para'>"+time_arr[id_arr.length-1]+"</div>")
        $("#table-center").append("<div class='para'>"+beat_arr[id_arr.length-1]+"</div>")
        $("#table-right").append("<div class='para'>"+oxy_arr[id_arr.length-1]+"</div>")
        $("#table-left2").append("<div class='para'>"+id_arr[id_arr.length-1]+"</div>")
    }
 } 
socket.on("thaynguong-thanhcong", function(){
     $('#thaynguong-status').html("");
     $('#thaynguong-status').show();
     $('#thaynguong-status').append("Thay Đổi Ngưỡng Thành Công");
     setTimeout(function(){ 
        $('#thaynguong-status').hide();
    }, 5000);
   
 });
socket.on("Canhbao-on", function(){
    $('#checked').attr('checked', true);
    $('#warning-show').hide();
     audio.pause();
 });
socket.on("Canhbao-off", function(){
     $('#checked').attr('checked', false);
     $('#warning-show').show();
 });
socket.on("Canhbao", function(){
    $('#warning').show();
    audio.play();
 });

socket.on("tat-thu-cong", function(){
    $("#warning").hide();
        audio.pause();
})
     

$(document).ready(function(){
   $("#page-back").click(function() {
        page = page + 1;
        $("#table-left1").html("");
        $("#table-center").html("");
        $("#table-right").html("");
        $("#table-left2").html("");
         $("#current").html("");
    $("#current").append("<div class='page'</div>"+(page+1)+"/"+(begin_page+1));
        for(let i = page*itemPerPage; i < id_arr.length && i < (page+1)*itemPerPage; i++)
        {       
            $("#table-left1").append("<div class='para'>"+time_arr[i]+"</div>")
            $("#table-center").append("<div class='para'>"+beat_arr[i]+"</div>")
            $("#table-right").append("<div class='para'>"+oxy_arr[i]+"</div>")
            $("#table-left2").append("<div class='para'>"+id_arr[i]+"</div>")
        }
    if(page==begin_page){
        $("#page-back").hide();
        $("#ve-trang-dau").hide();
        $("#ve-trang-cuoi").show();
     }
     else{
        $("#page-next").show();
        $("#ve-trang-dau").show();
        $("#ve-trang-cuoi").show();
    }    
    });
     $("#page-next").click(function() {
        page = page - 1;
        $("#table-left1").html("");
        $("#table-center").html("");
        $("#table-right").html("");
        $("#table-left2").html("");
         $("#current").html("");
        $("#current").append("<div class='page'</div>"+(page+1)+"/"+(begin_page+1));
        for(let i = page*itemPerPage; i < id_arr.length && i < (page+1)*itemPerPage; i++)
        {       
            $("#table-left1").append("<div class='para'>"+time_arr[i]+"</div>")
            $("#table-center").append("<div class='para'>"+beat_arr[i]+"</div>")
            $("#table-right").append("<div class='para'>"+oxy_arr[i]+"</div>")
            $("#table-left2").append("<div class='para'>"+id_arr[i]+"</div>")
        }
        if(page==0){
        $("#page-next").hide();
        $("#ve-trang-dau").show();
        $("#ve-trang-cuoi").hide();
     }
     else{
        $("#page-back").show();
        $("#ve-trang-dau").show();
        $("#ve-trang-cuoi").show();
    }    
    }); 


       $("#ve-trang-dau").click(function() {
        page = begin_page;
        $("#table-left1").html("");
        $("#table-center").html("");
        $("#table-right").html("");
        $("#table-left2").html("");
         $("#current").html("");
        $("#current").append("<div class='page'</div>"+(page+1)+"/"+(begin_page+1));
        for(let i = page*itemPerPage; i < id_arr.length && i < (page+1)*itemPerPage; i++)
        {       
            $("#table-left1").append("<div class='para'>"+time_arr[i]+"</div>")
            $("#table-center").append("<div class='para'>"+beat_arr[i]+"</div>")
            $("#table-right").append("<div class='para'>"+oxy_arr[i]+"</div>")
            $("#table-left2").append("<div class='para'>"+id_arr[i]+"</div>")
        }
        if(page==begin_page){
        $("#ve-trang-dau").hide();
        $("#page-back").hide();
        $("#ve-trang-cuoi").show();
        $("#page-next").show();
     }
    }); 

         $("#ve-trang-cuoi").click(function() {
        page = 0;
        $("#table-left1").html("");
        $("#table-center").html("");
        $("#table-right").html("");
        $("#table-left2").html("");
         $("#current").html("");
        $("#current").append("<div class='page'</div>"+(page+1)+"/"+(begin_page+1));
        for(let i = page*itemPerPage; i < id_arr.length && i < (page+1)*itemPerPage; i++)
        {       
            $("#table-left1").append("<div class='para'>"+time_arr[i]+"</div>")
            $("#table-center").append("<div class='para'>"+beat_arr[i]+"</div>")
            $("#table-right").append("<div class='para'>"+oxy_arr[i]+"</div>")
            $("#table-left2").append("<div class='para'>"+id_arr[i]+"</div>")
        }
        if(page==0){
        $("#ve-trang-cuoi").hide();
        $("#page-next").hide();
        $("#ve-trang-dau").show();
        $("#page-back").show();
     }
    }); 


    $('#thaynguong-status').hide();
    $("#thaynguong-button").click(function(){
        socket.emit("thaynguong1", $("#pin1").val());
        socket.emit("thaynguong2", $("#pin2").val());
    });
    $("#warning-button").click(function(){
        $("#warning").hide();
        audio.pause();
        socket.emit("tat-thu-cong-web","");
    });
    $('#checked').change(function(){
    if(this.checked) {
        socket.emit("canhbao",1);
    }
    else {
        socket.emit("canhbao",0);
    }
    });
})


// setInterval(function(){
//     var whatTimeIsThis = new Date()
//     document.getElementById("RTC").innerHTML = whatTimeIsThis.toString().slice(0,34)
// }, 1000)
