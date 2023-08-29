import { Client, SlashCommandBuilder, CommandInteraction, EmbedBuilder }  from "discord.js";
import editJsonFile from "edit-json-file";
import { createHash } from "node:crypto";
import { writeFileSync, rmSync } from "node:fs";
let file = editJsonFile("./data/data.json");

export const data = new SlashCommandBuilder()
.setName('toggle')
.setDescription("Opens or closes the poll")
export const index = "Admin";

/**
* @param {CommandInteraction} interaction
* @param {Client} client
*/
export function execute(interaction, args, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw "Guild not found!";

    if (interaction.channel.type === "DM") {
        interaction.followUp({ content: "You cannot use this command in DM!" });
        return;
    }

    //seed
    if (!file.get("isOpen")) {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let seed = "";

        for (let x = 0; x < 32; x++) {
            seed += characters[Math.floor(Math.random() * characters.length)];
        }

        let publicHash = createHash("sha512")
            .update(seed)
            .digest("base64");

        writeFileSync("./data/seed.seed", seed, { encoding: "utf-8" });
        writeFileSync("./data/publicHash.seed", publicHash, { encoding: "utf-8" });

        console.log("New seed generated.");
        console.log('Seed hash: ' + publicHash);
        console.time('Voting period');
    }
    else {
        rmSync('./data/seed.seed');
        console.log("Seed erased.");
        console.timeEnd('Voting period');
    }

    file.set("isOpen", !file.get("isOpen"));
    file.save();

    let embed = new EmbedBuilder()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setAuthor({ name: file.get("method") })
        .setDescription(`Poll is now ${file.get("isOpen") ? "open" : "closed"}.`);

    interaction.editReply({
        embeds: [embed]
    });
}