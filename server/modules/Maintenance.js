let Maintenance = {};

Maintenance.getTrends = function(messages, callback)
{
    let words = [];
    for(let i = 0;i < messages.length;i++)
    {
        const cleaned = messages[i].replace(/,|\.|\n|\r|\t/g, '');
        const parts = cleaned.split(' ');
        words = words.concat(parts);
    }
    
    let trends = [];
    for(let i = 0;i < words.length;i++)
    {
        let found = false;
        for(let j = 0;j < trends.length;j++)
        {
            if(trends[j].word == words[i])
            {
                found = true;
                trends[j].count++;
                break;
            }
        }
        
        if(!found)
        {
            trends.push({
                word: words[i],
                count: 1
            });
        }
    }
    
    callback(trends);
};

//Merge trends
Maintenance.mergeTrends = function(oldTrends, newTrends, callback)
{
    let trends = [];
    for(let i = 0;i < newTrends.length;i++)
    {
        //If already in trends array
        let found = false;
        for(let j = 0;j < trends.length;j++)
        {
            if(trends[j].word == newTrends[i].word)
            {
                found = true;
                trends[j].count++;
                break;
            }
        }
        
        if(!found)
        {
            //If already in oldTrends array
            let found = false;
            for(let j = 0;j < oldTrends.length;j++)
            {
                if(oldTrends[j].word == newTrends[i].word)
                {
                    found = true;
                    trends.push({
                        word: newTrends[i].word,
                        count: oldTrends[j].count + 1
                    });
                    break;
                }
            }
            
            if(!found)
            {
                trends.push({
                    word: newTrends[i].word,
                    count: 1
                });
            }
        }
    }
    
    callback(trends);
};

module.exports = Maintenance;
