import { Client, SlashCommandBuilder, CommandInteraction } from "discord.js";
import editJsonFile from 'edit-json-file';
let file = editJsonFile("../data/data.json");

export const data = new SlashCommandBuilder()
.setName('vote')
.setDescription("Casts a vote.")
//.addUserOption(option => option 
//
//)
//export const admin = false;

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export async function execute(interaction, args, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw "Guild not found!";

}