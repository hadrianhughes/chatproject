const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;

const Users = require('./modules/Users.js');
const Chat = require('./modules/Chat.js');

let messages = [];
let connections = [];
let users = [];
let filters = [];

io.on('connection', function(socket)
{
    console.log('New connection.');
    connections.push({
        id: socket.id,
        location: {},
        filter: 'default-filter'
    });
    socket.join('default-filter');
    
    //Login page events
    socket.on('signUp', function(email, password)
    {
        Users.makeAccount(database, email, password, function(success, id)
        {
            if(success)
            {
                for(let i = 0;i < users.length;i++)
                {
                    if(id.toString() == users[i].userId.toString())
                    {
                        io.to(users[i].socketId).emit('logout');
                        break;
                    }
                }
                users.push({
                    userId: id.toString(),
                    socketId: socket.id.toString()
                });
                
                socket.emit('loginSuccess', id);
            }
            else
            {
                console.log('Account creation for email ' + email + ' failed.');
            }
        });
    });
    
    socket.on('login', function(email, password)
    {
        Users.login(database, email, password, function(success, id)
        {
            if(success)
            {
                for(let i = 0;i < users.length;i++)
                {
                    if(id.toString() == users[i].userId.toString())
                    {
                        io.to(users[i].socketId).emit('leaveRoom');
                        io.to(users[i].socketId).emit('logout');
                        users.splice(i, 1);
                        break;
                    }
                }
                
                users.push({
                    userId: id.toString(),
                    socketId: socket.id.toString()
                });
                socket.emit('loginSuccess', id);
            }
            else
            {
                console.log('Login for email ' + email + ' failed.');
            }
        });
    });
    
    socket.on('loginCheck', function(id)
    {
        Users.checkLoginId(database, id, function(correct)
        {
            socket.emit('loginCorrect', correct);
        });
    });
    
    //Chat page events
    socket.on('myLocation', function(latitude, longitude)
    {
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                connections[i].location = { lat: latitude, long: longitude };
            }
        }
    });
    
    socket.on('newMsg', function(user, filter, msg, command, arg)
    {
        if(msg)
        {
            messages.push(msg);
            
            //Default filter allows message to broadcast globally
            if(!filter) filter = 'default-filter';
            
            //Find username of user
            Users.findUsername(database, user, function(success, username)
            {
                if(success)
                {
                    //Check any commands given
                    if(command == '/pm')
                    {
                        //Find user given as argument
                        if(arg)
                        {
                            Users.findUserId(database, arg, function(success2, id)
                            {
                                if(success2)
                                {
                                    for(let i = 0;i < users.length;i++)
                                    {
                                        if(users[i].userId == id)
                                        {
                                            socket.broadcast.to(users[i].socketId).emit('newMsg', msg, username, true);
                                            break;
                                        }
                                    }
                                }
                                else
                                {
                                    console.log('Username ' + arg + ' was not found.');
                                }
                            });
                        }
                    }
                    else
                    {
                        //Send back to sender first
                        socket.emit('newMsg', msg, username, false);
                        
                        //Get my lat and long
                        let lat, long;
                        for(let i = 0;i < connections.length;i++)
                        {
                            if(connections[i].id == socket.id)
                            {
                                lat = connections[i].location.lat;
                                long = connections[i].location.long;
                            }
                        }
                        
                        //Find other users in my filter in range and send to them
                        for(let i = 0;i < connections.length;i++)
                        {
                            if(io.sockets.adapter.rooms[filter])
                            {
                                for(let j in io.sockets.adapter.rooms[filter].sockets)
                                {
                                    if(connections[i].id == j)
                                    {
                                        getDistance(lat, long, connections[i].location.lat, connections[i].location.long, function(dist)
                                        {
                                            if(dist <= 40)
                                            {
                                                socket.broadcast.to(connections[i].id).emit('newMsg', msg, username, false);
                                            }
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    console.log('User with ID ' + user + ' was not found.');
                }
            });
        }
    });
    
    socket.on('privateMsg', function(from, to, message)
    {
        console.log(from, to, message);
    });
    
    socket.on('getFilters', function()
    {
        //Get my lat and long
        let lat, long;
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                lat = connections[i].location.lat;
                long = connections[i].location.long;
            }
        }
        
        //Find other filters nearby
        let nearbyFilters = [];
        //For every filter
        for(let i in io.sockets.adapter.rooms)
        {
            //Make sure room is filter
            if(filters.indexOf(i) > -1)
            {
                //For each socket connected to the current room
                for(let j in io.sockets.adapter.rooms[i].sockets)
                {
                    //For every connection on server
                    for(let k = 0;k < connections.length;k++)
                    {
                        //If current connection is same as socket found in room
                        if(connections[k].id == j)
                        {
                            //If this connection has a location
                            if(connections[k].location.lat != undefined && connections[k].location.long != undefined)
                            {
                                //Calculate distance between requesting user and this connection
                                getDistance(lat, long, connections[k].location.lat, connections[k].location.long, function(dist)
                                {
                                    //If smaller than or equal to 40km
                                    if(dist <= 40)
                                    {
                                        //If already in array, increase count, else add to array
                                        let found = false;
                                        for(let l = 0;l < nearbyFilters.length;l++)
                                        {
                                            if(nearbyFilters[l].value == i)
                                            {
                                                found = true;
                                                nearbyFilters[l].count++;
                                                break;
                                            }
                                        }
                                        if(!found)
                                        {
                                            //Add filter to array
                                            nearbyFilters.push({
                                                value: i,
                                                count: 1
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        
        
        socket.emit('filtersList', nearbyFilters);
    });
    
    socket.on('getNearbyUsers', function()
    {
        //Get my lat and long
        let lat, long;
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                lat = connections[i].location.lat;
                long = connections[i].location.long;
            }
        }
        
        (function(callback)
        {
            //Array for names to be sent back
            let names = [];
            
            for(let i = 0;i < connections.length;i++)
            {
                getDistance(lat, long, connections[i].location.lat, connections[i].location.long, function(dist)
                {
                    if(dist <= 40)
                    {
                        for(let j = 0;j < users.length;j++)
                        {
                            if(users[j].socketId == connections[i].id)
                            {
                                Users.findUsername(database, users[j].userId, function(success, username)
                                {
                                    if(username && names.length < 10)
                                    {
                                        names.push(username);
                                    }
                                    
                                    if(i == connections.length - 1)
                                    {
                                        callback(names);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        })(function(names)
        {
            socket.emit('userList', names);
        });
    });
    
    socket.on('filterConnect', function(filter)
    {
        socket.join(filter);
        filters.push(filter);
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                socket.leave(connections[i].filter);
                connections[i].filter = filter;
            }
        }
        
        socket.emit('connectedFilter', filter);
    });
    
    socket.on('leaveFilter', function()
    {
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                socket.leave(connections[i].filter);
                socket.emit('leftFilter');
            }
        }
    });
    
    socket.on('disconnect', function()
    {
        for(let i = 0;i < connections.length;i++)
        {
            if(connections[i].id == socket.id)
            {
                connections.splice(i, 1);
            }
        }
        console.log('Connection ended.');
    });
});

function getDistance(lat1, long1, lat2, long2, callback)
{
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);
    long1 = long1 * (Math.PI / 180);
    long2 = long2 * (Math.PI / 180);
    const R = 6371;
    
    const dLat = lat2 - lat1;
    const dLong = long2 - long1;
    
    const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dLong / 2) * Math.sin(dLong / 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    
    callback(d);
}

//Start server
app.set('port', 3000);
const server = http.listen(app.get('port'), function()
{
    const port = server.address().port;
    console.log('Waiting on port ' + port + '...');
});

//Establish connection to database
let database;
MongoClient.connect('mongodb://localhost:27017/chatproject', function(err, db)
{
    if(err)
    {
        throw err;
    }
    
    database = db;
});

app.use(express.static('public'));
