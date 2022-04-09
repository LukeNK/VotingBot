"use strict";
require("dotenv").config();
const {Client, Collection, Intents} = require('discord.js');
const fs = require('fs');
const intents = new Intents(process.env.INTENTS);
const client = new Client({intents: [intents], partials: JSON.parse(process.env.PARTIALS)});
client.login(process.env.TOKEN);

client.commands = new Collection();
client.callbacks = new Collection();
client.arrayOfSlashCommands = [];

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(let file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    client.arrayOfSlashCommands.push(command);
}

const listenerFiles = fs.readdirSync('./callbacks/').filter(file => file.endsWith('.js'));
for(let lFile of listenerFiles){
    const listener = require(`./callbacks/${lFile}`);
    client.callbacks.set(listener.name, listener);
}

client.on('ready', ()=>client.callbacks.get("ready").execute(client));
client.on("interactionCreate", interaction=>client.callbacks.get("interactionCreate").execute(interaction, client));