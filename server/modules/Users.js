const ObjectId = require('mongodb').ObjectID;

let Users = {};

Users.makeAccount = function(db, username, email, password, callback)
{
    try
    {
        db.collection('users').findOne({
            "$or": [{
                "email" : email
            }, {
                "username" : username
            }]
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    callback(false);
                }
                else
                {
                    try
                    {
                        db.collection('users').save({
                            "username" : username,
                            "email" : email,
                            "password" : password
                        }, function(err)
                        {
                            if(err)
                            {
                                throw err;
                            }
                            else
                            {
                                try
                                {
                                    db.collection('users').findOne({
                                        "email" : email
                                    }, function(err, doc)
                                    {
                                        if(err)
                                        {
                                            throw err;
                                        }
                                        else
                                        {
                                            if(doc)
                                            {
                                                callback(true, doc._id);
                                            }
                                            else
                                            {
                                                callback(false);
                                            }
                                        }
                                    });
                                }
                                catch(ex)
                                {
                                    throw ex;
                                }
                            }
                        });
                    }
                    catch(ex)
                    {
                        console.log(ex);
                        callback(false);
                    }
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
};

Users.login = function(db, username, password, callback)
{
    try
    {
        db.collection('users').findOne({
            "username" : username,
            "password" : password
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    const randString = generateRandString();
                    
                    try
                    {
                        db.collection('users').save({
                            "_id" : doc._id,
                            "username" : doc.username,
                            "password" : doc.password,
                            "randString" : randString
                        }, function(err)
                        {
                            if(err)
                            {
                                throw err;
                            }
                            else
                            {
                                callback(true, doc._id, randString);
                            }
                        });
                    }
                    catch(ex)
                    {
                        console.log(ex);
                        callback(false);
                    }
                }
                else
                {
                    callback(false);
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
};

Users.autoLogin = function(db, id, string, callback)
{
    try
    {
        db.collection('users').findOne({
            "_id" : ObjectId(id)
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    if(doc.randString == string)
                    {
                        callback(true);
                    }
                }
                else
                {
                    callback(false);
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
};

Users.checkLoginId = function(db, id, callback)
{
    try
    {
        db.collection('users').findOne({
            "_id" : ObjectId(id)
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    callback(true);
                }
                else
                {
                    callback(false);
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
};

Users.findUsername = function(db, id, callback)
{
    try
    {
        db.collection('users').findOne({
            "_id" : ObjectId(id)
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    callback(true, doc.username);
                }
                else
                {
                    callback(false);
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
};

Users.findUserId = function(db, username, callback)
{
    try
    {
        db.collection('users').findOne({
            "username" : username
        }, function(err, doc)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(doc)
                {
                    callback(true, doc._id);
                }
                else
                {
                    callback(false);
                }
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
}

module.exports = Users;

function generateRandString()
{
    const possChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0',];
    
    let string = '';
    for(let i = 0;i < 10;i++)
    {
        string += possChars[Math.floor(Math.random() * possChars.length)];
    }
    
    return string;
}
