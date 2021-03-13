const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, message, params, args) => {
    const yardım = new Discord.MessageEmbed()
    .setColor(`#833baa`)
    .setAuthor(`TraxyBOT Komutları`, client.user.avatarURL()) // burayı elleme
    .setDescription(``)
    .addField(
        `🔰 **Koruma**`,
        `\`küfür-engel\`,\`reklam-engel\`,\`kanal-koruma\`,\`kanal-korum-sıfırla\`,\`rol-koruma\`,\`rol-koruma-sıfırla\`,\`spam\`,\`spam-kapat\``
    )

    .addField(
        `⚙ **Ayarlanabilir**`,
        `\`otorol\`,\`sayaç\`,\`mesaj-takip\`,\`mod-log\``
    )

    .addField(
        `⌛ **Moderasyon**`,
        `\`ban\`,\`ban-koruma\`,\`ban-koruma-sıfırla\`,\`mute\`,\`mute-yetkili-rol\`,\`mute-rol\`,\`mesaj-arındır\``
    )
    .setImage(`https://cdn.discordapp.com/attachments/819599917710049310/820213782315401226/standard6.gif`) // EMBED THUMBNAİL
    .setThumbnail(client.user.avatarURL()) // BURAYA DOKUNMA
    .setTimestamp()
    .setFooter(`©2021 TraxyBOT`, client.user.avatarURL()) // burayı elleme
message.channels.send(yardım)
};

exports.conf = {
    enable: true,
    guildOnly: false,
    aliases: ["yardım", "y"]
};

exports.help = {
    name: "yardım"
}