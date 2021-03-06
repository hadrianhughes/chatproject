const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;

const Users = require('./modules/Users.js');
const Chat = require('./modules/Chat.js');

let connections = [];
let filters = [];

io.on('connection', function(socket)
{
    console.log('New connection.');
    connections.push({
        id: socket.id,
        location: {}
    });
    socket.join('default-filter');
    
    //Login page events
    socket.on('signUp', function(email, password)
    {
        Users.makeAccount(database, email, password, function(success, id)
        {
            if(success)
            {
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
    
    socket.on('newMsg', function(user, filter, msg)
    {
        if(msg)
        {
            if(!filter) filter = 'default-filter';
            
            //Find username of user
            Users.findUsername(database, user, function(success, username)
            {
                if(success)
                {
                    //Send back to sender first
                    socket.emit('newMsg', msg, username);
                    
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
                        for(let j in io.sockets.adapter.rooms[filter].sockets)
                        {
                            if(connections[i].id == j)
                            {
                                getDistance(lat, long, connections[i].location.lat, connections[i].location.long, function(dist)
                                {
                                    if(dist <= 40)
                                    {
                                        socket.broadcast.to(connections[i].id).emit('newMsg', msg, username);
                                    }
                                });
                                break;
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

//Set up database
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
