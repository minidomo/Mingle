'use strict';

const Discord = require('discord.js');
const Config = require('./config');
const Profiles = require('./profiles');
const Handler = require('./handler');
const Logger = require('./logger');
const client = new Discord.Client();

require('./initialize');

client.once('ready', () => {
    Logger.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Chika Dance', { type: 'WATCHING' });
    client.guilds.forEach((value, key, map) => {
        Profiles.addGuild(value.id);
    });
});

client.on('message', msg => {
    if (msg.author.bot || !msg.guild)
        return;
    if (msg.content.startsWith(Config.prefix)) {
        const match = /^([^\w\d\s]+)/.exec(msg.content);
        if (match[1] === Config.prefix) {
            const obj = Handler.getArgs(msg.content);
            Handler.handle(msg, obj);
        }
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
    Logger.realError(err);
    exit();
});