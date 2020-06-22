const express = require('express');
const app = express();
const chalk = require('chalk');
const roblox = require('noblox.js');
const figlet = require('figlet');
const fetch = require('node-fetch');
const config = require('../config.json');

roblox.setCookie(config.cookie);

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

app.get('/', (req, res) => {
    res.sendStatus(200);
  });
  
app.get('/setrank', async (req, res) => {
    if(req.query.key !== config.key) return res.sendStatus(401);
    if(!req.query.username || !req.query.rank || !req.query.author) return res.sendStatus(400);
    let username = req.query.user;
    let rank = Number(req.query.rank);
    if(!rank){
        return res.sendStatus(400);
    }
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(config.groupId, id);
    let rankNameInGroup = await getRankName(config.groupId, id);
    if(config.maximumRank <= rankInGroup){
        return res.sendStatus(400);
    }
    let setRankResponse;
    try {
        setRankResponse = await roblox.setRank(config.groupId, id, rank);
    } catch (err) {
        console.log(chalk.red('An error occured when running the setrank function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(config.groupId, id);
    res.sendStatus(200);
    if(config.logwebhook === 'false') return;
    fetch(config.logwebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: 2127726,
            description: `${req.query.author} has ranked ${username} from ${rankNameInGroup} (${rankInGroup}) to ${setRankResponse.name} (${setRankResponse.rank}).`,
            footer: {
                text: 'Action Logs'
            },
            timestamp: new Date(),
            thumbnail: {
                url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
            }
        })
    });
});
  
app.get('/promote', async (req, res) => {
    if(req.query.key !== config.key) return res.sendStatus(401);
    if(!req.query.username || !req.query.author) return res.sendStatus(400);
    let username = req.query.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(config.groupId, id);
    let rankNameInGroup = await getRankName(config.groupId, id);
    if(config.maximumRank <= rankInGroup){
        return res.sendStatus(400);
    }
    let promoteResponse;
    try {
        promoteResponse = await roblox.promote(config.groupId, id);
    } catch (err) {
        console.log(chalk.red('An error occured when running the promote function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(config.groupId, id);
    res.sendStatus(200);
    if(config.logwebhook === 'false') return;
    fetch(config.logwebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: 2127726,
            description: `${req.query.author} has promoted ${username} from ${rankNameInGroup} (${rankInGroup}) to ${promoteResponse.name} (${promoteResponse.rank}).`,
            footer: {
                text: 'Action Logs'
            },
            timestamp: new Date(),
            thumbnail: {
                url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
            }
        })
    });
});

app.get('/demote', async (req, res) => {
    if(req.query.key !== config.key) return res.sendStatus(401);
    if(!req.query.username || !req.query.author) return res.sendStatus(400);
    let username = req.query.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(config.groupId, id);
    let rankNameInGroup = await getRankName(config.groupId, id);
    if(config.maximumRank <= rankInGroup){
        return res.sendStatus(400);
    }
    let demoteResponse;
    try {
        demoteResponse = await roblox.demote(config.groupId, id);
    } catch (err) {
        console.log(chalk.red('An error occured when running the promote function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(config.groupId, id);
    res.sendStatus(200);
    if(config.logwebhook === 'false') return;
    fetch(config.logwebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: 2127726,
            description: `${req.query.author} has promoted ${username} from ${rankNameInGroup} (${rankInGroup}) to ${demoteResponse.name} (${demoteResponse.rank}).`,
            footer: {
                text: 'Action Logs'
            },
            timestamp: new Date(),
            thumbnail: {
                url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
            }
        })
    });
});

app.get('/fire', async (req, res) => {
    if(req.query.key !== config.key) return res.sendStatus(401);
    if(!req.query.username || !req.query.author) return res.sendStatus(400);
    let username = req.query.user;
    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return res.sendStatus(400);
    }
    let rankInGroup = await getRankID(config.groupId, id);
    let rankNameInGroup = await getRankName(config.groupId, id);
    if(config.maximumRank <= rankInGroup){
        return res.sendStatus(400);
    }
    let fireResponse;
    try {
        fireResponse = await roblox.setrank(config.groupId, id, 1);
    } catch (err) {
        console.log(chalk.red('An error occured when running the fire function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(config.groupId, id);
    res.sendStatus(200);
    if(config.logwebhook === 'false') return;
    fetch(config.logwebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: 2127726,
            description: `${req.query.author} has fired ${username} from ${rankNameInGroup} (${rankInGroup}).`,
            footer: {
                text: 'Action Logs'
            },
            timestamp: new Date(),
            thumbnail: {
                url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
            }
        })
    });
});

app.get('/shout', async (req, res) => {
    if(req.query.key !== config.key) return res.sendStatus(401);
    if(!req.query.author) return res.sendStatus(400);
    let msg = req.query.msg;
    let shoutResponse;
    try {
        shoutResponse = await roblox.shout(config.groupId, msg);
    } catch (err) {
        console.log(chalk.red('An error occured when running the shout function: ' + err));
        return res.sendStatus(500);
    }
    let newRankName = await getRankName(config.groupId, id);
    res.sendStatus(200);
    if(config.logwebhook === 'false') return;
    fetch(config.logwebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            color: 2127726,
            description: `${req.query.author} has posted a shout:\n\`\`\`${msg}\`\`\``,
            footer: {
                text: 'Action Logs'
            },
            timestamp: new Date(),
            thumbnail: {
                url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`
            }
        })
    });
});

let listener = app.listen(process.env.PORT, async () => {
    console.log('Your app is currently listening on port: ' + listener.address().port);
});
