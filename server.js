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

    socket.on('mongodbsearch', function(data) {
        //load database handling module
        var risdd = require('./lib/risdd.js');

        // fill up overviews
        if( data['overview'] !== undefined ) {
            risdd.query({search : '', collection : 'person', key : 'title'},
                        function(requestResult){ socket.emit('serverdata', { type : 'ov_persons', data : requestResult })})
        }


        // handle user search
        if( data['userdata'] !== undefined ){
            risdd.query({ search : data['userdata'] , collection : 'sessions' , key : 'description' },
                        function(requestResult){ socket.emit('serverdata', { type : 'sessions' , data : requestResult });
            });

            risdd.query({ search : data['userdata'] , collection : 'person' , key : 'title' },
                        function(requestResult){ socket.emit('serverdata', { type : 'person', data : requestResult });
            });
        }
    });
    
});



