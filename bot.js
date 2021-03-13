const fs=require('fs'); // CASPER
const Discord=require("discord.js"); // CASPER
require('dotenv').config(); // CASPER
const client =new Discord.Client(); // CASPER
const db = require('quick.db') // CASPER
const ytdl = require('ytdl-core'); // CASPER
const chalk = require("chalk"); // CASPER
const YouTube = require('simple-youtube-api'); // CASPER
const moment = require("moment"); // CASPER
const Jimp = require('jimp'); // CASPER
const ayarlar =require("./ayarlar.json"); // CASPER
const express = require('express'); // eee bende turkish
/////
const app = express() // CASPER
app.get('/', (req, res) => res.send("Bot Online")) // CASPER
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT)) // CASPER
//////////////////


client.on("message", message => { // CASPER
  let client = message.client; // CASPER
  if (message.author.bot) return; // CASPER
  if (!message.content.startsWith(ayarlar.prefix)) return; // CASPER
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length); // CASPER
  let params = message.content.split(' ').slice(1); // CASPER
  let perms = client.yetkiler(message); // CASPER
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
     cmd.run(client, message, params, perms);
  }
})


client.on("ready", () => { 
  console.log(`${client.user.tag} adı ile giriş yapıldı!`);
  client.user.setStatus("idle");
  client.user.setActivity(''); // Bura olmucak yani durumu olmucak prefix !
})


const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

  
client.yetkiler = message => { // Bot Sahibi Yetkileri
  if(!message.guild) {
	return; }
  let permlvl = -ayarlar.varsayilanperm  ;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if(message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};

client.login(ayarlar.token) //Client'a giriş yap client.login('tokengiriniz') Bu Şekildede Olabilir
/////////////////////////// KOMUTLAR ///////////////////////////Ü,
// OTOROL \\
client.on("guildMemberAdd", async member => {
  let kanal = db.fetch(`casperkanal_${member.guild.id}`);
  let rol = db.fetch(`casperrol_${member.guild.id}`);
  let mesaj = db.fetch(`caspermesaj_${member.guild.id}`);

  if (!kanal) return;
  member.roles.add(rol);
  client.channels.cache
    .get(kanal)
    .send(
      "📣 **`" +
        member.user.username +
        "`** Adlı Kullanıcı Sunucuya Katıldı Rol Verildi Seninle Beraber `" +
        member.guild.memberCount +
        "` ✅"
    );
});
// OTOROL \\

//SAYAÇ \\
client.on("guildMemberAdd", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!sayac) return;
  if (member.guild.memberCount >= sayac) {
    member.guild.channels.cache
      .get(skanal)
      .send(
        ` <:duyur:793030802798936094> **${
          member.user.tag
        }** Sunucuya **Katıldı**! \`${db.fetch(
          `sayac_${member.guild.id}`
        )}\` Kullanıcı Oldu Sayaç Başarıyla Sıfırlandı.`
      );
    db.delete(`sayac_${member.guild.id}`);
    db.delete(`sayacK_${member.guild.id}`);
    return;
  } else {
    member.guild.channels.cache
      .get(skanal)
      .send(
        ` ✅ **${
          member.user.tag
        }**  Adlı Kullanıcı Sunucuya **Katıldı** \`${db.fetch(
          `sayac_${member.guild.id}`
        )}\` Kullanıcı Olmaya  \`${db.fetch(`sayac_${member.guild.id}`) -
          member.guild.memberCount}\` Kullanıcı Kaldı. \`${
          member.guild.memberCount
        }\` Kişiyiz!`
      );
  }
});

client.on("guildMemberRemove", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal = await db.fetch(`sayacK_${member.guild.id}`);
  if (!sayac) return;
  member.guild.channels.cache
    .get(skanal)
    .send(
      ` ❎ **${
        member.user.tag
      }** Adlı Kullanıcı Sunucudan **Ayrıldı** \`${db.fetch(
        `sayac_${member.guild.id}`
      )}\` Kullanıcı Olmaya \`${db.fetch(`sayac_${member.guild.id}`) -
        member.guild.memberCount}\` Kullanıcı Kaldı. \`${
        member.guild.memberCount
      }\` Kişiyiz!`
    );
});
//SAYAÇ \\

// BAN SİSTEM
client.on("guildBanAdd", async (guild, user) => {
  let kontrol = await db.fetch(`dil_${guild.id}`);
  let kanal = await db.fetch(`bank_${guild.id}`);
  let rol = await db.fetch(`banrol_${guild.id}`);
  if (!kanal) return;
  if (kontrol == "agayokaga") {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor("#833baa")
      .addField(`Yasaklayan`, entry.executor.tag)
      .addField(`Yasaklanan Kişi`, user.name)
      .addField(
        `Sonuç`,
        `Yasaklayan kişi sunucudan açıldı!\nve yasaklanan kişinin yasağı kalktı!`
      );
    client.channels.cache.get(kanal).send(embed);
  } else {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor("#833baa")
      .addField(`Yasaklayan`, entry.executor.tag)
      .addField(`Yasaklanan Kişi`, user.name)
      .addField(
        `Sonuç`,
        `Yasaklayan Kişi Sunucudan Atıldı ve yasaklanan kişinin yasağı kalktı `
      );
    client.channels.cache.get(kanal).send(embed);
  }
});
// BAN SİSTEM

client.on("channelCreate", async(channel) => {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

    if (!modlog) return;

    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());

    let kanal;

    if (channel.type === "text") kanal = `<#${channel.id}>`

    if (channel.type === "voice") kanal = `\`${channel.name}\``

    let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal**", `${kanal}`)

    .setTimestamp()

    .setColor("#833baa")

    .setFooter(`Sunucu: ${channel.guild.name} - ${channel.guild.id}`, channel.guild.iconURL())

    .setThumbnail(channel.guild.iconUR)

    client.channels.cache.get(modlog).send(embed)

    })

client.on("channelDelete", async(channel) => {

  let modlog = await db.fetch(`log_${channel.guild.id}`);

    if (!modlog) return;

    const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());

    let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor("#833baa")

    .setFooter(`Sunucu: ${channel.guild.name} - ${channel.guild.id}`, channel.guild.iconURL())

    .setThumbnail(channel.guild.iconURL)

    client.channels.cache.get(modlog).send(embed)

    })

client.on("roleCreate", async(role) => {

let modlog = await db.fetch(`log_${role.guild.id}`);

if (!modlog) return;

const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Rol Oluşturma")

.addField("**Rolü oluşturan kişi**", `<@${entry.executor.id}>`)

.addField("**Oluşturulan rol**", `\`${role.name}\` **=** \`${role.id}\``)

.setTimestamp()

.setFooter(`Sunucu: ${role.guild.name} - ${role.guild.id}`, role.guild.iconURL)

.setColor("#833baa")

.setThumbnail(role.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("roleDelete", async(role) => {

let modlog = await db.fetch(`log_${role.guild.id}`);

if (!modlog) return;

const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Rol Silme")

.addField("**Rolü silen kişi**", `<@${entry.executor.id}>`)

.addField("**Silinen rol**", `\`${role.name}\` **=** \`${role.id}\``)

.setTimestamp()

.setFooter(`Sunucu: ${role.guild.name} - ${role.guild.id}`, role.guild.iconURL)

.setColor("#833baa")

.setThumbnail(role.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiCreate", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Emoji Oluşturma")

.addField("**Emojiyi oluşturan kişi**", `<@${entry.executor.id}>`)

.addField("**Oluşturulan emoji**", `${emoji} - İsmi: \`${emoji.name}\``)

.setTimestamp()

.setColor("#833baa")

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiDelete", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Emoji Silme")

.addField("**Emojiyi silen kişi**", `<@${entry.executor.id}>`)

.addField("**Silinen emoji**", `${emoji}`)

.setTimestamp()

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setColor("#833baa")

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiUpdate", async(oldEmoji, newEmoji) => {

let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

if (!modlog) return;

const entry = await oldEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Emoji Güncelleme")

.addField("**Emojiyi güncelleyen kişi**", `<@${entry.executor.id}>`)

.addField("**Güncellenmeden önceki emoji**", `${oldEmoji} - İsmi: \`${oldEmoji.name}\``)

.addField("**Güncellendikten sonraki emoji**", `${newEmoji} - İsmi: \`${newEmoji.name}\``)

.setTimestamp()

.setColor("#833baa")

.setFooter(`Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`, oldEmoji.guild.iconURL)

.setThumbnail(oldEmoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanAdd", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Yasaklama")

.addField("**Kullanıcıyı yasaklayan yetkili**", `<@${entry.executor.id}>`)

.addField("**Yasaklanan kullanıcı**", `**${user.tag}** - ${user.id}`)

.addField("**Yasaklanma sebebi**", `${entry.reason}`)

.setTimestamp()

.setColor("#833baa")

.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanRemove", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem**", "Yasak kaldırma")

.addField("**Yasağı kaldıran yetkili**", `<@${entry.executor.id}>`)

.addField("**Yasağı kaldırılan kullanıcı**", `**${user.tag}** - ${user.id}`)

.setTimestamp()
// CASPER
.setColor("#833baa")
// CASPER
.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)
// CASPER
// CASPER
client.channels.cache.get(modlog).send(embed)

})
// MOD LOG

//küfür engel //
const küfür = [
  "siktir",
  "fuck",
  "puşt",
  "pust",
  "piç",
  "sikerim",
  "sik",
  "yarra",
  "yarrak",
  "amcık",
  "orospu",
  "orosbu",
  "orosbucocu",
  "oç",
  ".oc",
  "ibne",
  "yavşak",
  "bitch",
  "dalyarak",
  "amk",
  "awk",
  "taşak",
  "taşşak",
  "daşşak",
"sikm",
"sikim",
"sikmm",
"skim",
"skm",
"sg"
];
client.on("messageUpdate", async (old, nev) => {

if (old.content != nev.content) {
let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
if (i) {

if (küfür.some(word => nev.content.includes(word))) {
if (nev.member.hasPermission("BAN_MEMBERS")) return ;
 //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
const embed = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${nev.author} , **Mesajını Editleyerek Küfür Etmeye Çalıştı!**`)
      .addField("Küfür:",nev)
  
      nev.delete();
      const embeds = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${nev.author} , **Mesajı Editleyerek Küfür Etmene İzin Veremem!**`) 
    client.channels.cache.get(y).send(embed)
      nev.channel.send(embeds).then(msg => msg.delete({timeout:5000}));
    
}
} else {
}
if (!i) return;
}
});

client.on("message", async msg => {


if(msg.author.bot) return;
if(msg.channel.type === "dm") return;
   let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
    if (i) {
        if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
          try {
           if (!msg.member.hasPermission("MANAGE_GUILD")) {
           //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
msg.delete({timeout:750});
              const embeds = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`<@${msg.author.id}> , **Bu Sunucuda Küfür Yasak!**`)
msg.channel.send(embeds).then(msg => msg.delete({timeout: 5000}));
          const embed = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${msg.author} , **Küfür Etmeye Çalıştı!**`) .addField("Mesajı:",msg)
         client.channels.cache.get(y).send(embed)
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
   if(!i) return ;
});

// KÜFÜR ENGEL

//ROL VE KANAL KORUMA
client.on("roleCreate", async role => {
const entry = await role.guild
.fetchAuditLogs({ type: "ROLE_CREATE" })
.then(audit => audit.entries.first());
let rol = await db.fetch(`rolrol_${role.guild.id}`);
let kontrol = await db.fetch(`dil_${role.guild.id}`);
let kanal = await db.fetch(`rolk_${role.guild.id}`);
if (!kanal) return;
if (kontrol == "agayokaga") {
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == role.guild.owner.id) return;
role.delete();

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Rol Açıldı!`)
.setColor("#833baa")
.addField(`Açan`, entry.executor.tag)
.addField(`Açılan Rol`, role.name)
.addField(`Sonuç`, `Rol Geri Silindi!`);
client.channels.cache.get(kanal).send(embed);
} else {
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == role.guild.owner.id) return;
role.delete();

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Rol Açıldı!`)
.setColor("#833baa")
.addField(`Rolu Açan`, entry.executor.tag)
.addField(`Açılan Rol`, role.name)
.addField(`Sonuç`, `Açılan Rol Geri Silindi!`);
client.channels.cache.get(kanal).send(embed);
}
});

client.on("channelDelete", async channel => {
let kontrol = await db.fetch(`dil_${channel.guild.id}`);
let kanal = await db.fetch(`kanalk_${channel.guild.id}`);
if (!kanal) return;
if (kontrol == "agayokaga") {
const entry = await channel.guild
.fetchAuditLogs({ type: "CHANNEL_DELETE" })
.then(audit => audit.entries.first());
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == channel.guild.owner.id) return;
channel.guild.channels.create(channel.name, channel.type, [
{
  id: channel.guild.id,
  position: channel.calculatedPosition
}
]);

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Kanal Silindi!`)
.addField(`Silen`, entry.executor.tag)

.addField(`Silinen Kanal`, channel.name)
.addField(`Sonuç`, `Kanal Geri Açıldı!`)

.setColor("#833baa");
client.channels.cache.get(kanal).send(embed);
} else {
const entry = await channel.guild
.fetchAuditLogs({ type: "CHANNEL_DELETE" })
.then(audit => audit.entries.first());
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == channel.guild.owner.id) return;
channel.guild.channels.create(channel.name, channel.type, [
{
  id: channel.guild.id,
  position: channel.calculatedPosition
}
]);

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Kanal Silindi!`)
.addField(`Kanalı Silen`, entry.executor.tag)
.setColor("#833baa")
.addField(`Silinen Kanal`, channel.name)
.addField(`Sonuç`, `Silinen Kanal Geri Açıldı!`);
client.channels.cache.get(kanal).send(embed);
}
});

client.on("channelCreate", async channel => {
let kontrol = await db.fetch(`dil_${channel.guild.id}`);
let kanal = await db.fetch(`kanalk_${channel.guild.id}`);
if (!kanal) return;
if (kontrol == "agayokaga") {
const entry = await channel.guild
.fetchAuditLogs({ type: "CHANNEL_CREATE" })
.then(audit => audit.entries.first());
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == channel.guild.owner.id) return;
channel.delete();
const embed = new Discord.MessageEmbed()
.setTitle(`Bir Kanal Açıldı!`)
.setColor("#833baa")
.addField(`Açan`, entry.executor.tag)
.addField(`Açılan Kanal`, channel.name)
.addField(`Sonuç`, `Kanal Geri Silindi!`);
client.channels.cache.get(kanal).send(embed);
} else {
const entry = await channel.guild
.fetchAuditLogs({ type: "CHANNEL_CREATE" })
.then(audit => audit.entries.first());
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == channel.guild.owner.id) return;
channel.delete();
const embed = new Discord.MessageEmbed()
.setTitle(`Bir Kanal Açıldı!`)
.setColor("#833baa")
.addField(`Kanalı Açan`, entry.executor.tag)
.addField(`Açılan Kanal`, channel.name)
.addField(`Sonuç`, `Açılan Kanal Geri Silindi`);
client.channels.cache.get(kanal).send(embed);
}
});
// ROL KORUMA
client.on("roleDelete", async role => {
const entry = await role.guild
.fetchAuditLogs({ type: "ROLE_DELETE" })
.then(audit => audit.entries.first());
let rol = await db.fetch(`rolrol_${role.guild.id}`);
let kontrol = await db.fetch(`dil_${role.guild.id}`);
let kanal = await db.fetch(`rolk_${role.guild.id}`);
if (!kanal) return;
if (kontrol == "TR_tr") {
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == role.guild.owner.id) return;
role.guild.roles
.create({
  data: {
    name: role.name
  }
})
.then(r => r.setPosition(role.position));

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Rol Silindi!`)
.setColor("#833baa")
.addField(`Silen`, entry.executor.tag)
.addField(`Silinen Rol`, role.name)
.addField(`Sonuç`, `Rol Geri Açıldı!`);
client.channels.cache.get(kanal).send(embed);
} else {
if (entry.executor.id == client.user.id) return;
if (entry.executor.id == role.guild.owner.id) return;
role.guild.roles
.create({
  data: {
    name: role.name
  }
})
.then(r => r.setPosition(role.position));

const embed = new Discord.MessageEmbed()
.setTitle(`Bir Rol Silindi!`)
.setColor("#833baa")
.addField(`Silen`, entry.executor.tag)
.addField(`Silinen Rol`, role.name)
.addField(`Sonuç`, `Silinen Rol Geri Açıldı!`);
client.channels.cache.get(kanal).send(embed);
}
});
// ROL VE KANAL KORUMA

// REKLAM KORUMA

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".com.tr",
  ".biz",
  "net",
  ".rf",
  ".gd",
  ".az",
  ".party",
".gf"
];
client.on("messageUpdate", async (old, nev) => {

if (old.content != nev.content) {
let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
if (i) {

if (reklam.some(word => nev.content.includes(word))) {
if (nev.member.hasPermission("BAN_MEMBERS")) return ;
 //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
const embed = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${nev.author} , **Mesajını Editleyerek Reklam Yapmaya Çalıştı!**`)
      .addField("Reklamı:",nev)
  
      nev.delete();
      const embeds = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${nev.author} , **Mesajı Editleyerek Reklam Yapamana İzin Veremem!**`) 
    client.channels.cache.get(y).send(embed)
      nev.channel.send(embeds).then(msg => msg.delete({timeout:5000}));
    
}
} else {
}
if (!i) return;
}
});

client.on("message", async msg => {


if(msg.author.bot) return;
if(msg.channel.type === "dm") return;
   let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
    if (i) {
        if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
          try {
           if (!msg.member.hasPermission("MANAGE_GUILD")) {
           //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
msg.delete({timeout:750});
              const embeds = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`<@${msg.author.id}> , **Bu Sunucuda Reklam Yapmak Yasak!**`)
msg.channel.send(embeds).then(msg => msg.delete({timeout: 5000}));
          const embed = new Discord.MessageEmbed() .setColor("#833baa") .setDescription(`${msg.author} , **Reklam Yapmaya Çalıştı!**`) .addField("Mesajı:",msg)
         client.channels.cache.get(y).send(embed)
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
   if(!i) return ;
});


// REKLAM KORUMA

// MESAJ TAKİP
client.on("message", async (message) => {

  if (message.author.bot || message.channel.type == "dm") return;

  let mesajtakip = message.guild.channels.cache.get(await db.fetch(`mesajtakip_${message.guild.id}`));

  if (!mesajtakip) return;

  const embed = new Discord.MessageEmbed()

    .setAuthor(message.author.username + " | Adlı Kullanıcı Şu Mesajı Attı")

    .setColor(`#833baa`)

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "")

  mesajtakip.send(embed)

})

client.on("messageDelete", async (message) => {

  if (message.author.bot || message.channel.type == "dm") return;

  let mesajtakip = message.guild.channels.cache.get(await db.fetch(`mesajtakip_${message.guild.id}`));

  if (!mesajtakip) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Adlı Kullanıcı Şu Mesajı Geri Silindi")

    .setColor(`#833baa`)

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "")

    mesajtakip.send(embed)

})

client.on("messageUpdate", async (oldMessage, newMessage) => {

  let mesajtakip = await db.fetch(`mesajtakip_${oldMessage.guild.id}`);

  if (!mesajtakip) return;

  let embed = new Discord.MessageEmbed()

  .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

  .addField("**Eylem**", "Mesaj Düzenleme")

  .addField("**Mesajın sahibi**", `<@${oldMessage.author.id}> = **${oldMessage.author.id}**`)

  .addField("**Eski Mesajı**", `${oldMessage.content}`)

  .addField("**Yeni Mesajı**", `${newMessage.content}`)

  .setTimestamp()

  .setColor("#833baa")

  .setFooter(`Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`, oldMessage.guild.iconURL())

  .setThumbnail(oldMessage.guild.iconURL)

  client.channels.cache.get(mesajtakip).send(embed)

});
// MESAJ TAKİP