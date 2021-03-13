const Discord = require('discord.js');
const db = require('quick.db') 
const proxie = require('../ayarlar.json');
exports.run = (client, message, args) => {

if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('Bu Özelliği Kullanabilmek İçin `Yönetici` Yetkisine Sahip Olmalısın')

  if(!db.fetch(`casperkanal_${message.guild.id}`)) return message.channel.send('Zaten Otorol Kapalı')
   

   message.reply('Otorol Sistemi Başarıyla Kapatıldı Ayarlamak İçin: !otorol @rol #kanal')
db.delete(`casperkanal_${message.guild.id}`)   
  db.delete(`casperrol_${message.guild.id}`)
db.delete(`caspermesaj_${message.guild.id}`)

}; 

exports.conf = { 
enabled: true,
guildOnly: false,
 aliases: [], 
permLevel: 0
}

exports.help = {
 name: 'otorol-kapat', 
description: 'taslak',
 usage: 'otorolkapat' 
};