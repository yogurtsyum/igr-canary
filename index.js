const express = require('express');
const app = express();
const chalk = require('chalk');
const roblox = require('noblox.js');
const figlet = require('figlet');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

roblox.setCookie(process.env.cookie);
const jsonParser = bodyParser.json();

async function getRankName(func_group, func_user){
    let rolename = await roblox.getRankNameInGroup(func_group, func_user);
    return rolename;
}

async function getRankID(func_group, func_user){
    let role = await roblox.getRankInGroup(func_group, func_user);
    return role;
}

async function getRankFromName(func_rankname, func_group){
    let roles = await roblox.getRoles(func_group);
    let role = await roles.find(rank => rank.name == func_rankname);
    if(!role){
        return 'NOT_FOUND';
    }
    return role.rank;
}

app.get('/', async (req, res) => {
    res.sendStatus(200);
});
  
app.post('/setrank', jsonParser, async (req, res) => {
    if(req.body.key !== process.env.key) return res.sendStatus(401);
    if(!req.body.user || !req.body.rank || !req.body.author) return res.sendStatus(400);
    let username = req.body.user;
    let rank = Number(req.body.rank);
    if(!rank){
        return res.sendStatus(400);
    }
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup || Number(process.env.maximumRank) <= rank){
        return res.sendStatus(400);
    }
    let setRankResponse;
    try {
        setRankResponse = await roblox.setRank(Number(process.env.groupId), id, rank);
    } catch (err) {
        console.log(chalk.red('An error occured when running the setrank function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(Number(process.env.groupId), id);
    res.sendStatus(200);
    if(process.env.logwebhook === 'false') return;
    fetch(process.env.logwebhook, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            embeds: [{
                color: 2127726,
                description: `${req.body.author} has ranked ${username} from ${rankNameInGroup} (${rankInGroup}) to ${setRankResponse.name} (${setRankResponse.rank}).`,
                footer: {
                    text: 'Action Logs'
                },
                timestamp: new Date(),
                thumbnail: {
                    url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
                }
            }]
        })
    });
});
  
app.post('/promote', jsonParser, async (req, res) => {
    if(req.body.key !== process.env.key) return res.sendStatus(401);
    if(!req.body.user || !req.body.author) return res.sendStatus(400);
    let username = req.body.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup || Number(process.env.maximumRank) <= rankInGroup + 1){
        return res.sendStatus(400);
    }
    let promoteResponse;
    try {
        promoteResponse = await roblox.promote(Number(process.env.groupId), id);
    } catch (err) {
        console.log(chalk.red('An error occured when running the promote function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(Number(process.env.groupId), id);
    res.sendStatus(200);
    if(process.env.logwebhook === 'false') return;
    fetch(process.env.logwebhook, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            embeds: [{
                color: 2127726,
                description: `${req.body.author} has promoted ${username} from ${rankNameInGroup} (${rankInGroup}) to ${promoteResponse.newRole.name} (${promoteResponse.newRole.rank}).`,
                footer: {
                    text: 'Action Logs'
                },
                timestamp: new Date(),
                thumbnail: {
                    url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
                }
            }]
        })
    });
});

app.post('/demote', jsonParser, async (req, res) => {
    if(req.body.key !== process.env.key) return res.sendStatus(401);
    if(!req.body.user || !req.body.author) return res.sendStatus(400);
    let username = req.body.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup){
        return res.sendStatus(400);
    }
    let demoteResponse;
    try {
        demoteResponse = await roblox.demote(Number(process.env.groupId), id);
    } catch (err) {
        console.log(chalk.red('An error occured when running the promote function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(Number(process.env.groupId), id);
    res.sendStatus(200);
    if(process.env.logwebhook === 'false') return;
    fetch(process.env.logwebhook, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            embeds: [{
                color: 2127726,
                description: `${req.body.author} has demoted ${username} from ${rankNameInGroup} (${rankInGroup}) to ${demoteResponse.newRole.name} (${demoteResponse.newRole.rank}).`,
                footer: {
                    text: 'Action Logs'
                },
                timestamp: new Date(),
                thumbnail: {
                    url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
                }
            }]
        })
    });
});

app.post('/fire', jsonParser, async (req, res) => {
    if(req.body.key !== process.env.key) return res.sendStatus(401);
    if(!req.body.user || !req.body.author) return res.sendStatus(400);
    let username = req.body.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup){
        return res.sendStatus(400);
    }
    let fireResponse;
    try {
        fireResponse = await roblox.setRank(Number(process.env.groupId), id, 1);
    } catch (err) {
        console.log(chalk.red('An error occured when running the fire function: ' + err));
        return res.sendStatus(500);
    }
    res.sendStatus(200);
    if(process.env.logwebhook === 'false') return;
    fetch(process.env.logwebhook, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            embeds: [{
                color: 2127726,
                description: `${req.body.author} has fired ${username} from ${rankNameInGroup} (${rankInGroup}).`,
                footer: {
                    text: 'Action Logs'
                },
                timestamp: new Date(),
                thumbnail: {
                    url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
                }
            }]
        })
    });
});

app.post('/shout', jsonParser, async (req, res) => {
    if(req.body.key !== process.env.key) return res.sendStatus(401);
    let msg = req.body.msg;
    let shoutResponse;
    try {
        shoutResponse = await roblox.shout(Number(process.env.groupId), msg);
    } catch (err) {
        console.log(chalk.red('An error occured when running the shout function: ' + err));
        return res.sendStatus(500);
    }
    res.sendStatus(200);
    if(process.env.logwebhook === 'false') return;
    fetch(process.env.logwebhook, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            embeds: [{
                color: 2127726,
                description: `${req.body.author} has posted a shout:\n\`\`\`${msg}\`\`\``,
                footer: {
                    text: 'Action Logs'
                },
                timestamp: new Date(),
                thumbnail: {
                    url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${req.body.author}`
                }
            }]
        })
    });
});

let listener = app.listen(process.env.PORT, async () => {
    console.log('Your app is currently listening on port: ' + listener.address().port);
});
