import { Client } from "discord.js";
import editJsonFile from "edit-json-file";

export const name = "ready";

/**
* @param {Client} client
*/
export function execute(client) {
    let file = editJsonFile("./data/data.json");
    console.log(`${process.env.npm_package_name} (${process.env.npm_package_license}) made by ${process.env.npm_package_author}\nCurrent version: ${process.env.npm_package_version}\n${!parseInt(process.env.TEMP_TEST) ? 'Normal working condition' : 'Experimental testing condition'}`);

    client.user.setPresence({
        status: "online",
        activities: [{
            name: file.get('title'),
            type: "PLAYING"
        }]
    });

    if (parseInt(process.env.TEMP_TEST)) {
        client.guilds.cache.get(process.env.GUILD_ID).commands.set(client.slashCommands);
    }
    else {
        client.guilds.cache.get(process.env.GUILD_ID).commands.set([]);
        client.application.commands.set(client.slashCommands);
    }

}