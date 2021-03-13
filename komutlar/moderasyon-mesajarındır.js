const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
//

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if(!args[0]) return message.reply(" En Az \`1 - 5000\` Arasında Bir Tam Sayı Değeri Girmelisiniz.");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Temizlendi **${args[0]}** .`).then(msg => msg.delete(5000));
  });
}

module.exports.help = {
  name: "mesaj-arındır"
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['mesaj-arındır'],
  permLevel: 0,
};

exports.help = {
  name: 'mesaj-arındır',
  description: 'Mesajları siler',
  usage: 'sil sayı',
}