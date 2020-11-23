var socket = io("http://localhost:8000");
var id_arr = [];
var time_arr = [];
var beat_arr = [];
var oxy_arr = [];
var nguongcao;
var nguongthap;
var audio = new Audio("canhbao.mp3");
audio.loop = true;
socket.on("nguongthap1", function (data) {
  nguongthap = data;
});
socket.on("nguongcao1", function (data) {
  nguongcao = data;
});
// setTimeout(function () {
//   socket.emit("send_full");
// }, 2000);
socket.on("send-full", function (data) {
  // id_arr = [];
  // time_arr = [];
  // beat_arr = [];
  // oxy_arr = [];
  $("#data-table").html("");
  data.forEach(function (item) {
    // id_arr.push(item.id);
    // time_arr.push(item.time);
    // beat_arr.push(item.beat);
    // oxy_arr.push(item.oxy);
    if (item.beat > nguongcao) {
      $("#data-table").append(
        "<tr><td>" +
          item.id +
          "</td><td class='danger'>" +
          item.time +
          "</td><td class='danger'>" +
          item.beat +
          "</td><td>" +
          item.oxy +
          "</td></tr>"
      );
    }
    if (item.beat < nguongthap) {
      $("#data-table").append(
        "<tr><td>" +
          item.id +
          "</td><td class='low'>" +
          item.time +
          "</td><td class='low'>" +
          item.beat +
          "</td><td>" +
          item.oxy +
          "</td></tr>"
      );
    }
    if (item.beat <= nguongcao && item.beat >= nguongthap) {
      $("#data-table").append(
        "<tr><td>" +
          item.id +
          "</td><td>" +
          item.time +
          "</td><td>" +
          item.beat +
          "</td><td>" +
          item.oxy +
          "</td></tr>"
      );
    }
  });
  // for (let i = page * itperPage; i < id_arr.length; i++) {
  //   if (beat_arr[i] >= nguongcao || beat_arr[i] <= nguongthap) {
  //     $("#table-left1").append("<div class='para_1'>" + time_arr[i] + "</div>");
  //     $("#table-center").append(
  //       "<div class='para_1'>" + beat_arr[i] + "</div>"
  //     );
  //     $("#table-right").append("<div class='para_1'>" + oxy_arr[i] + "</div>");
  //     $("#table-left2").append("<div class='para_1'>" + id_arr[i] + "</div>");
  //     console.log(id_arr[i]);
  //   }
  //   if (beat_arr[i] < nguongcao && beat_arr[i] > nguongthap) {
  //     $("#table-left1").append("<div class='para_2'>" + time_arr[i] + "</div>");
  //     $("#table-center").append(
  //       "<div class='para_2'>" + beat_arr[i] + "</div>"
  //     );
  //     $("#table-right").append("<div class='para_2'>" + oxy_arr[i] + "</div>");
  //     $("#table-left2").append("<div class='para_2'>" + id_arr[i] + "</div>");
  //     console.log(id_arr[i]);
  //   }
  // }
});
socket.on("server-update-data", function (data) {
  // id_arr.push(data.id);
  // time_arr.push(data.time);
  // beat_arr.push(data.beat);
  // oxy_arr.push(data.oxy);
  // updateTable();
  // if (id_arr.length == (begin_page + 1) * itperPage) {
  //   begin_page = begin_page + 1;
  //   $("#current").html("");
  //   $("#current").append(
  //     "<div class='page'></div>" + (page + 1) + "/" + (begin_page + 1)
  //   );
  //   $("#page-back").show();
  //   $("#ve-trang-dau").show();
  // }
  if (item.beat > nguongcao) {
    $("#data-table").append(
      "<tr><td>" +
        item.id +
        "</td><td class='danger'>" +
        item.time +
        "</td><td class='danger'>" +
        item.beat +
        "</td><td>" +
        item.oxy +
        "</td></tr>"
    );
  }
  if (item.beat < nguongthap) {
    $("#data-table").append(
      "<tr><td>" +
        item.id +
        "</td><td class='low'>" +
        item.time +
        "</td><td class='low'>" +
        item.beat +
        "</td><td>" +
        item.oxy +
        "</td></tr>"
    );
  } else {
    $("#data-table").append(
      "<tr><td>" +
        item.id +
        "</td><td>" +
        item.time +
        "</td><td>" +
        item.beat +
        "</td><td>" +
        item.oxy +
        "</td></tr>"
    );
  }
});
// function updateTable() {
//   if (id_arr.length < (begin_page + 1) * itperPage + 1 && page == begin_page) {
//     if (
//       beat_arr[id_arr.length - 1] < nguongcao &&
//       beat_arr[id_arr.length - 1] > nguongthap
//     ) {
//       $("#table-left1").append(
//         "<div class='para_2'>" + time_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-center").append(
//         "<div class='para_2'>" + beat_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-right").append(
//         "<div class='para_2'>" + oxy_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-left2").append(
//         "<div class='para_2'>" + id_arr[id_arr.length - 1] + "</div>"
//       );
//     }
//     if (
//       beat_arr[id_arr.length - 1] >= nguongcao ||
//       beat_arr[id_arr.length - 1] <= nguongthap
//     ) {
//       $("#table-left1").append(
//         "<div class='para_1'>" + time_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-center").append(
//         "<div class='para_1'>" + beat_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-right").append(
//         "<div class='para_1'>" + oxy_arr[id_arr.length - 1] + "</div>"
//       );
//       $("#table-left2").append(
//         "<div class='para_1'>" + id_arr[id_arr.length - 1] + "</div>"
//       );
//     }
//   }
// }
socket.on("thaynguong-thanhcong", function () {
  // $("#thaynguong-status").html("");
  // $("#thaynguong-status").show();
  // $("#thaynguong-status").append("Thay Đổi Ngưỡng Thành Công");
  // setTimeout(function () {
  //   $("#thaynguong-status").hide();
  // }, 5000);
  alert("Đã thay đổi ngưỡng thành công");
  document.querySelector(".form").classList.remove("active-form");
  document.querySelector(".black").classList.remove("black-active");
  document.querySelector("#navbar-right a").classList.add("active");
  document.querySelector(".warning").classList.remove("active");
});
socket.on("thaynguong-thatbai", function () {
  alert("Mật khẩu không đúng, mời nhập lại");
});
socket.on("Canhbao-on", function () {
  // $("#checked").attr("checked", true);
  // $("#warning-show").hide();
  audio.pause();
});
socket.on("Canhbao-off", function () {
  // $("#checked").attr("checked", false);
  // $("#warning-show").show();
});
socket.on("Canhbao", function () {
  // $("#warning").show();
  audio.play();
});

socket.on("tat-thu-cong", function () {
  $("#warning").hide();
  audio.pause();
});

$(document).ready(function () {
  // $("#thaynguong-status").hide();
  $("#thaynguong-button").click(function () {
    socket.emit("thaynguong1", $("#pin1").val());
    socket.emit("thaynguong2", $("#pin2").val());
    socket.emit("matkhau", $("#pin3").val());
  });
  $("#warning-button").click(function () {
    $("#warning").hide();
    audio.pause();
    socket.emit("tat-thu-cong-web", "");
  });
  $("#checked").change(function () {
    if (this.checked) {
      socket.emit("canhbao", 1);
    } else {
      socket.emit("canhbao", 0);
    }
  });
});
