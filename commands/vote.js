import { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder, ChannelType, RoleFlagsBitField, RoleFlags }  from "discord.js";
import { createHash } from "node:crypto";
import editJsonFile from "edit-json-file";
import { readFileSync } from "node:fs";
let file = editJsonFile("./data/data.json");

export const data = new SlashCommandBuilder()
.setName('vote')
.setDescription("Casts a vote.")
.addUserOption(option => option
    .setName("ballot")
    .setDescription("Your ballot. Check /poll for instruction. NOBODY CAN FORCE YOU TO SHOW BALLOT, INCLUDING OFFICIALS!"))

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export async function execute(interaction, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw new Error("Guild not found!");

    //check if poll is open
    if (!file.get("isOpen")) {
        interaction.editReply(makeEmbed("Poll has been closed, you cannot vote!"));
        return;
    }

    //check if in DM
    if (interaction.channel.type !== ChannelType.DM) {
        interaction.editReply(makeEmbed("You can only vote in this bot's DM!"));
        return;
    }

    //get seed + publicHash
    const seed = readFileSync("./data/seed.seed", { encoding: "utf-8" });
    const publicHash = readFileSync("./data/publicHash.seed", { encoding: "utf-8" });

    //check if the seed is tampered
    let seedHash = createHash("sha512")
        .update(seed)
        .digest("base64");
    if (seedHash != publicHash) {
        interaction.editReply(makeEmbed("The seed was tampered! Please report to the Election Commission."));
        console.error('The seed was tampered! Vote closed.');
        file.set('isOpen', false); // close vote
        return;
    }

    //check if citizen
    if (!guild.members.cache.get(interaction.user.id)?.roles?.cache?.get(process.env.CITIZEN_ROLE_ID)) {
        interaction.editReply(makeEmbed("You are not a citizen of the Bayer Free State, therefore you are not allowed to vote!"));
        console.log(`User <@!${interaction.user.id}> attempted to vote while not being a citizen.`);
        return;
    }

    //create user's hash
    let userHash = createHash("sha512")
        .update(interaction.user.id + seed)
        .digest("base64");

    //check if user has voted (compare user's has to file)
    if (file.get("voterHash").includes(userHash)) {
        interaction.editReply(makeEmbed("You have already voted, therefore you are not allowed to vote!"));
        console.log(`User <@!${interaction.user.id}> attempted to vote while having already voted.`);
        return;
    }

    //enter ballot and shuffle ballot array
    let ballot = interaction.options.get("ballot").value
        .toLowerCase()
        .trim()
        .split(' ');
    let options = [];
    for (const option of file.get('options')) options.push(option.name);
    for (const option of ballot)
        if (!options.includes(option))
            return interaction.editReply(makeEmbed("Your ballot is invalid! Please only input the allowed options."));
    if (file.get('methodId') <= 2) { // ranked system
        let lookUp = [];
        for (const option of ballot) {
            if (lookUp.includes(option))
                return interaction.editReply(makeEmbed("Your ballot is invalid! Please only rank the candidates once."));
            lookUp.push(option);
        }
    } else if (file.get('methodId') == 3 && ballot.length != 1) // single choice
        return interaction.editReply(makeEmbed("Your ballot is invalid! Please only choose one (1) option."));
    file.set("ballots", shuffle([...file.get("ballots"), ballot]));

    //enter user hash and suffle voter hash array
    file.set("voterHash", shuffle([...file.get("voterHash"), userHash]));

    //save
    file.save();

    //tell the user that they have voted
    interaction.editReply(makeEmbed("Your ballot has successfully been cast!"));
}

//make embed objects for plain text
function makeEmbed(text){
    return {
        embeds: [
            new EmbedBuilder()
                .setColor(process.env.DEFAULT_COLOR)
                .setDescription(text)
        ]
    };
}

//shuffle arrays
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}