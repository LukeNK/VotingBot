"use strict";
import 'dotenv'; configDotenv();
import { REST, Routes, Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import { configDotenv } from 'dotenv';
const client = new Client({
    intents: [ GatewayIntentBits.Guilds ],
    partials: [ Partials.Channel ]
});
client.login(process.env.TOKEN);

client.commands = new Collection();
client.callbacks = new Collection();
client.slashCommands = [];

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(let file of commandFiles){
    let command = import(`./commands/${file}`);
    if(parseInt(process.env.TEMP_TEST)){
        command.description = `[EXPERIMENTAL] ${command.description}`;
        command.options.find(v => v.type === "SUB_COMMAND_GROUP")?.options.forEach(v => v.description = `[EXPERIMENTAL] ${v.description}`);
    };
    client.commands.set(command.name, command);
    client.slashCommands.push(command);
}

const listenerFiles = fs.readdirSync('./callbacks/').filter(file => file.endsWith('.js'));
for(let lFile of listenerFiles){
    let listener = import(`./callbacks/${lFile}`);
    client.callbacks.set(listener.name, listener);
}

client.on('ready', () => client.callbacks.get("ready").execute(client));
client.on("interactionCreate", interaction => client.callbacks.get("interactionCreate").execute(interaction, client));

// to register commands
new REST().setToken(process.env.TOKEN).put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: client.commands },
).catch(console.log)
