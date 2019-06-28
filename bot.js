'use strict';

const Discord = require('discord.js');
const Config = require('./config');
const Profiles = require('./profiles');
const Handler = require('./handler');
const client = new Discord.Client();

require('./initialize');

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    // client.user.setActivity('Games!');
    client.guilds.forEach((value, key, map) => {
        Profiles.addGuild(value.id);
    });
});

client.on('message', msg => {
    console.log(`<${msg.author.username}> ${msg.content}`);
    if (msg.author.bot || !msg.guild)
        return;
    if (msg.content.startsWith(Config.prefix)) {
        const obj = Handler.getArgs(msg.content);
        Handler.handle(msg, obj);
    }
});

client.login(Config.token);

const exit = () => {
    Profiles.save();
    process.exit(0);
};

process.on('SIGTERM', exit);
process.on('SIGINT', exit);
process.on('uncaughtException', err => {
    console.error(err);
    exit();
});