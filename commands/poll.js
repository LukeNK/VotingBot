import { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder}  from "discord.js";
import editJsonFile from "edit-json-file";
let file = editJsonFile("./data/data.json");

export const data = new SlashCommandBuilder()
.setName('poll')
.setDescription("Shows the poll.")
export const index = "Vote";

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export function execute(interaction, args, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw "Guild not found!";

    let embed = new EmbedBuilder()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setDescription(file.get("description"))
        .setImage(file.get("image"))
        .setAuthor({ name: file.get("method") })
        .setFooter({ text: file.get("footer") })
        .addFields({ name: "\u200b", value: "**OPTIONS**" });

    let options = file.get("options");
    options.forEach(v => embed.addField(`${v.name?.toUpperCase()}`, v.description));

    interaction.editReply({ embeds: [embed] });
}