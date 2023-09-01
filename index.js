"use strict";
import { configDotenv } from 'dotenv'; configDotenv();
import { REST, Routes, Client, Collection, GatewayIntentBits, Partials, Events } from 'discord.js';
import fs from 'fs';
import editJsonFile from 'edit-json-file';
const client = new Client({
    intents: [ GatewayIntentBits.Guilds ],
    partials: [ Partials.Channel ]
});
client.login(process.env.TOKEN);

client.commands = new Collection();
client.callbacks = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
(async () => {
    for(let file of commandFiles){
        let command = await import(`./commands/${file}`);
        if (parseInt(process.env.TEMP_TEST)) {
            command.description = `[EXPERIMENTAL] ${command.description}`;
            command.options.find(v => v.type === "SUB_COMMAND_GROUP")?.options.forEach(v => v.description = `[EXPERIMENTAL] ${v.description}`);
        };
        client.commands.set(command.data.name, command);
    }
})();

client.on(Events.ClientReady, async () => {
    let file = editJsonFile("./data/data.json");
    console.log(`${process.env.npm_package_name} (${process.env.npm_package_license}) made by ${process.env.npm_package_author}\nCurrent version: ${process.env.npm_package_version}\n${!parseInt(process.env.TEMP_TEST) ? 'Normal working condition' : 'Experimental testing condition'}`);

    client.user.setPresence({
        status: "online",
        activities: [{
            name: file.get('title'),
            type: "WATCHING"
        }]
    });
});
client.on(Events.InteractionCreate, interaction => import("./events/interactionCreate.js").then(v => v.execute(interaction, client)).catch(console.error));

// to register commands
new REST().setToken(process.env.TOKEN).put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: client.commands },
).catch(console.log);
