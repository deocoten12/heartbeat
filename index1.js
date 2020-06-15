var express = require('express')
var mysql = require('mysql')
var mqtt = require('mqtt')

var app = express()

app.use(express.static("public"))
app.set("views engine", "ejs")
app.set("views", "./views")
var server = require("http").Server(app)
var io = require('socket.io')(server)
server.listen(process.env.PORT || 8080)
app.get("/", function(req, res){
    res.render("dothi.ejs");
});
app.get("/dothi.ejs", function(req, res){
    res.render("dothi.ejs");
});
app.get("/lichsu.ejs", function(req, res){
    res.render("lichsu.ejs");
});
app.get("/thaynguong.ejs", function(req,  res){
    res.render("thaynguong.ejs");
});

//----------------------MQTT-------------------------
// var client = mqtt.connect("mqtt://localhost:1883",{clientId:"mqttjs01"}); 
//var client = mqtt.connect("mqtt://broker.hivemq.com",{clientId:"mqttjs01"});   
var client = mqtt.connect("broker.hivemq.com", 1883, 60); 
var topic2 = "orion-canhbao"; //LED cảnh báo hoặc còi ...
var message="test message";
var topic1 = "orion-heartbeat"

console.log("connected flag  " + client.connected);
client.on("connect",function(){ 
    console.log("connected  "+ client.connected);   
    });

client.on("error",function(error){
    console.log("Can't connect" + error);
    process.exit(1)});  

client.subscribe("orion-heartbeat");
client.subscribe("tat-thu-cong");

//----------------------------------------------------

// SQL--------------------------------------
// var con = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'datnguyen',
//     password : '123456',
//     database : 'sinhvien'
// });

var con = mysql.createConnection({
 host     : 'us-cdbr-east-06.cleardb.net',
 user     : 'b315b8ae360c48',
 password : 'd07d4384',
 database : 'heroku_46d626e7af30ec0'
});

con.connect(function(err) {
	if (err) 
		throw err;
	console.log("mysql connected");
    var sql ="CREATE TABLE IF NOT EXISTS sensors12(ID int(10) not null, Time datetime not null, Heartbeat int(3) not null, Oxygen int(3) not null )"
	con.query(sql, function(err){
		if (err) 
			throw err;
        console.log("Table created");
    });
    var sql1 = "SELECT * FROM sensors12 ORDER BY ID DESC limit 1"
        con.query(sql1, function(err, result, fields){
            if (err) throw err;
            result.forEach(function(value) {
                console.log("max id: " + value.ID);
                count=value.ID
        })
    });
})


var oxy_graph=[]; 
var heartbeat_graph=[]; 
var date_graph=[];

var m_time;
var newHeartbeat;
var newOxy;
var nguongcao; 
var nguongthap; 
var mode=1;
var count;


client.on('message',function(topic, message, packet){
    console.log("message is "+ message)
    console.log("topic is "+ topic)
    
    newHeartbeat = JSON.parse(message).Heartbeat
    newOxy = JSON.parse(message).Oxygen

    if(topic == "tat-thu-cong"){
        io.sockets.emit("tat-thu-cong", "")
    }

    if(topic == topic1 && newHeartbeat != null && newOxy != null && newHeartbeat>0 && newOxy>0){

        console.log("ready to save")
        count = count + 1
        var n = new Date()//.toMysqlFormat();
        var month = n.getMonth() + 1
        var Date_and_Time = n.getFullYear()+"-"+month+"-"+n.getDate() +" "+ n.getHours()+":"+n.getMinutes()+":"+n.getSeconds();
        console.log(Date_and_Time)
        var sql = "INSERT INTO sensors12 (ID, Time, Heartbeat, Oxygen) VALUES ('" + count + "', '" + Date_and_Time.toString() + "', '" + newHeartbeat + "', '" + newOxy + "')"
        con.query(sql, function(err, result){
            if (err) throw err;
            console.log("Table inserted");
            console.log(Date_and_Time +" "+ newHeartbeat +" "+ newOxy)
                    // })       
                        // console.log(result)
                        // console.log(tempData)
        });
        var sql1 = "SELECT * FROM sensors12 ORDER BY ID DESC limit 1"
        con.query(sql1, function(err, result, fields){
            if (err) throw err;
            console.log("Data selected");
            result.forEach(function(value) {
                m_time = value.Time.toString().slice(4,24);
                newHeartbeat = value.Heartbeat
                newOxy = value.Oxygen
                console.log(m_time + " " + value.Heartbeat + " " + value.Oxygen);
                // tempFulldata.push({id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity})
                io.sockets.emit('server-update-data', {id: value.ID, time: m_time, beat: value.Heartbeat, oxy: value.Oxygen})
            })       
            // console.log(result)
            // console.log(tempData)

            if (oxy_graph.length < 20) {
                oxy_graph.push(newOxy);
            }
            else{
                for(i=0;i<19;i++){
                    oxy_graph[i]=oxy_graph[i+1];
                }
                oxy_graph[19]=newOxy;
            }

            if (heartbeat_graph.length<20) {
                heartbeat_graph.push(newHeartbeat);
            }
            else{
                for(u=0;u<19;u++){
                    heartbeat_graph[u]=heartbeat_graph[u+1];
                }
                heartbeat_graph[19]=newHeartbeat;
            }

            if (date_graph.length<20) {
                date_graph.push( m_time);
            }
            else{
                for(x=0;x<19;x++){
                    date_graph[x]=date_graph[x+1];
                }
                date_graph[19]=m_time;
            }
            
            console.log(heartbeat_graph)

            io.sockets.emit("server-send-oxy_graph",oxy_graph);
            io.sockets.emit("server-send-heartbeat_graph",heartbeat_graph);
            io.sockets.emit("server-send-date_graph",date_graph);
            //  io.sockets.emit("nguongcao",nguongcao);
            // io.sockets.emit("nguongthap",nguongthap);
            if(((newHeartbeat>=nguongcao)||(newHeartbeat<=nguongthap))&&(mode==1)){
                io.sockets.emit("Canhbao");
                mode = 0;
                client.publish(topic2, "on")
                io.sockets.emit("Canhbao-off");
            }
            if(((newHeartbeat<nguongcao)&&(newHeartbeat>nguongthap))&&(mode==0)){
                mode = 1;
                io.sockets.emit("Canhbao-on");
                client.publish(topic2, "off")
            }
        });
    };
});

//-----------------------------------------
//Socket

// io.sockets.emit("send-full", tempData)
io.on('connection', function(socket){
    console.log(socket.id + " connected")
    socket.on('disconnect', function(){
        console.log(socket.id + " disconnected")
    })
     io.sockets.emit("server-send-oxy_graph",oxy_graph);
    io.sockets.emit("server-send-heartbeat_graph",heartbeat_graph);
    io.sockets.emit("server-send-date_graph",date_graph);
    io.sockets.emit("nguongcao1",nguongcao);
    io.sockets.emit("nguongthap1",nguongthap);
    io.sockets.emit("nguongcao",nguongcao);
    io.sockets.emit("nguongthap",nguongthap);

    var sql1 = "SELECT * FROM sensors12 ORDER BY ID"
    con.query(sql1, function(err, result, fields){
        if (err) throw err;
        console.log("Full Data selected");
        var tempFulldata = []
        result.forEach(function(value) {
            var m_time = value.Time.toString().slice(4,24);
            tempFulldata.push({id: value.ID, time: m_time, beat: value.Heartbeat, oxy: value.Oxygen})
        })
        io.sockets.emit('send-full', tempFulldata)
    })
    //io.sockets.emit('send-full', tempFulldata)
    if(mode==1){
        io.sockets.emit("Canhbao-on");
        }else{
        io.sockets.emit("Canhbao-off");
    }
    socket.on("thaynguong1",function(data){
        nguongcao=data;
        console.log(data);
    });
    socket.on("canhbao",function(data){
        console.log(data);
        mode = data;
    });

    socket.on("thaynguong2",function(data){
        nguongthap=data;
        console.log(data);
        io.sockets.emit("thaynguong-thanhcong");
    });

    socket.on("tat-thu-cong-web",function(){
         client.publish(topic2, "off")
    });
    });
   // setInterval(function(){ 
   //   io.sockets.emit("nguongcao",nguongcao);
   //  io.sockets.emit("nguongthap",nguongthap);
   //  }, 3000);