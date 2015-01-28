var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/*
 * socket handling
 */
io.on('connection', function(socket) {
    //etwas vom client empfangen
    socket.on('mongodbsearch', function(data) {
        if( data['userdata'] != '' )

            //search in different collections with submudule risdd{} 
            var risdd = require("./lib/risdd.js");
            risdd.query({ search : data["userdata"] , collection : "sessions" , key : "description" },
                        function(requestResult){ socket.emit("serverdata", { type : "sessions" , data : requestResult });
            });

            risdd.query({ search : data["userdata"] , collection : "person" , key : "title" },
                        function(requestResult){ socket.emit("serverdata", { type : "person", data : requestResult });
            });
            
    });
});





