const Discord = require('discord.js');
const db = require('quick.db') 
const proxie = require('../ayarlar.json');
exports.run = (client, message, args) => {

if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send('Bu Özelliği Kullanabilmek İçin `Yönetici` Yetkisine Sahip Olmalısın')
let kanal = message.mentions.channels.first()
let rol = message.mentions.roles.first()
if(!rol) return message.reply('Rol Etiketlemelisin @rol')
if(!kanal) return message.reply('Otorol Mesajı Gideceği Kanalı Etiketlemelisin #kanal')

   
message.reply(`**Otorol aktif edildi**\n Kullanıcılara Verilecek Rol ${rol} Olarak Ayarladım Kayıt Kanalını İse ${kanal} Olarak Ayarladım\n \`@TraxyBOT\` **Rolünü Üstte Bulunması Gerekmektedir Yoksa Otorol Verilmez**`)
   
db.set(`casperkanal_${message.guild.id}`, kanal.id)   
  db.set(`casperrol_${message.guild.id}` , rol.id)
 };

exports.conf = { 
enabled: true,
guildOnly: false,
 aliases: ['otorol'], 
permLevel: 0
}

exports.help = {
 name: 'otorol-ayarla', 
description: 'taslak',
 usage: 'oto-rol-ayarla' 
};
