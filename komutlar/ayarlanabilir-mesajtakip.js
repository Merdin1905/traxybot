const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.`);

let mesajtakipk = message.mentions.channels.first();
let mesajtakipkanal = await db.fetch(`mesajtakip_${message.guild.id}`)
  
  if (args[0] === "sıfırla" || args[0] === "kapat") {
    if(!mesajtakipk) return message.channel.send(`Mesaj Takip Kanalı Zaten ayarlı değil.`);
    db.delete(`mesajtakip_${message.guild.id}`)
   message.channel.send(`Mesaj Takip Kanalı başarıyla sıfırlandı.`);
    return
  }
  //Casper
if (!mesajtakipk) return message.channel.send(`Yanlış Kullanım Doğru Kullanım: !mesaj-takip #kanal`);

db.set(`mesajtakip_${message.guild.id}`, mesajtakipk.id)

message.channel.send(`Mesaj Takip kanalı başarıyla ${mesajtakipk} olarak ayarlandı.`);

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['mesaj-takip','mesajtakip']
};

exports.help = {
    name: 'mesaj-takip',
    description: 'mesaj-takip kanalını belirler.',
    usage: 'mesaj-takip <#kanal>'
};