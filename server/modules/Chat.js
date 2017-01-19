let Chat = {};

Chat.sendMessage = function(db, user, message, filter, callback)
{
    try
    {
        db.collection('chat').save({
            "user" : user,
            "message" : message,
            "filter" : filter
        }, function(err)
        {
            if(err)
            {
                throw err;
            }
        });
    }
    catch(ex)
    {
        console.log(ex);
        callback(false);
    }
}

module.exports = Chat;
