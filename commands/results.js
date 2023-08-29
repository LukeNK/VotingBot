import { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder }  from "discord.js";
import editJsonFile from "edit-json-file";
let file = editJsonFile("./data/data.json");

export const data = new SlashCommandBuilder()
.setName('results')
.setDescription("Sends ballots and the data file.")
export const index = "Admin";

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export function execute(interaction, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw "Guild not found!";

    if (interaction.channel.type === "DM") {
        interaction.followUp({ content: "You cannot use this command in DM!" });
        return;
    }

    if (file.get("isOpen")) {
        interaction.followUp({ content: "You cannot reveal the results when the poll has not been closed!" });
        return;
    }

    let ballots = `Ballots of "${file.get("title")}"\n-------------\n\n\n`;

    file.get("ballots").forEach(v => ballots += `${v}\n\n`);

    ballots += `-------------\nIn total: ${file.get("ballots").length} ballot(s) cast.\n\n-------------\n`;

    // Count ballots
    if (file.get('methodId') == 1) { // Single transferable vote
        let inData = {
            seatsToFill: file.get('setings').seatsToFill,
            candidates: [],
            votes: [],
            report: console.log
        };
        let options = file.get('options');
        for (const candidate of options) inData.candidates.push(candidate.name);
        file.get('ballots').forEach(ballot => {
            inData.votes.push({
                weight: 1,
                preferences: ballot
            });
        });
    }

    let embed = new EmbedBuilder()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setAuthor({ name: file.get("method") })
        .setDescription("A text file containing all ballots and a JSON file containing the raw data.");

    interaction.editReply({
        embeds: [embed],
        files: [
            new MessageAttachment(Buffer.from(ballots), "ballots.txt"),
            "./data/data.json"
        ]
    });
}