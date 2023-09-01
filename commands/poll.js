import { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder}  from "discord.js";
import editJsonFile from "edit-json-file";
let file = editJsonFile("./data/data.json");

export const data = new SlashCommandBuilder()
.setName('poll')
.setDescription("Shows the poll.")

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export async function execute(interaction, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw new Error("Guild not found!");

    let options = file.get("options").map(v => {
        v.name = v.name.toUpperCase();
        v.value = v.description;
        v.description = null;
        return v;
    });

    let embed = new EmbedBuilder()
        .setColor(guild.members.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setDescription(file.get("description"))
        .setImage(file.get("image"))
        .setAuthor({ name: file.get("method") })
        .setFooter({ text: file.get("footer") })
        .addFields({ name: "\u200b", value: "**OPTIONS**" }, ...options)

    interaction.editReply({ embeds: [embed] });
}