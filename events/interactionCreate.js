import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { config } from "dotenv";

export const name = "interactionCreate";

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
export async function execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    let guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (!guild) throw new Error("Guild not found!");

    let cmd = client.commands.get(interaction.commandName);
    if (!cmd) throw new Error(`No command file ${interaction.commandName} found.`);

    // todo:
    // handle disabling and admin perm
    // fix commands
    // add buttons

    if (cmd.index === "Disabled")
        return sendInfo("This command is currently disabled.");
    if (cmd.admin === true && !(await guild.members.fetch(interaction.user.id)).roles.resolve(process.env.EC_ROLE_ID)) {
        return sendInfo("You do not have permission to use this command!");
    }

    // no use reply after this
    await interaction.deferReply();
    
    //catch all here because unhandled rejections crash everything now
    cmd.execute(interaction, client).catch(sendError);

    // log and report functions
    function sendInfo(text) {
        interaction.reply({ 
            embeds: [new EmbedBuilder()
                .setTitle("Info")
                .setDescription(text)
            ]
        });
    }
    function sendError(error) {
        interaction.followUp({
            embeds: [new EmbedBuilder()
                .setTitle("Error")
                .setDescription("This interaction has failed due to an error.")
                .addFields({ name: 'Error:', value: `\`\`\`\n${error.toString().slice(0, 1000)}\n\`\`\`` })
                .setFooter({ text: "Please contact the Election Commission for support."})
                .setColor(0xf0160b)
            ]
        });
        console.error(error);
    }
}

