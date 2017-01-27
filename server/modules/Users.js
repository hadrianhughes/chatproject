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
