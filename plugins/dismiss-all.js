import { cmd } from "../command.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "dismissall",
  alias: ["disall"],
  desc: "Remove admin rights from all admins except bot and owner - Powered by AAQIL MD",
  category: "group",
  react: "⚔️",
  filename: __filename
}, async (conn, mek, m, { from, isCreator, isBotAdmins, isAdmins, isGroup, reply, botNumber }) => {
  try {
    if (!isGroup) return await reply("⚠️ *This command only works in groups.*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");
    if (!isBotAdmins) return await reply("❌ *I must be admin to use this command.*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");
    if (!isAdmins && !isCreator) return await reply("🔐 *Only group admins or owner can use this command.*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");

    const groupMetadata = await conn.groupMetadata(from);
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';
    const botJid = botNumber.endsWith('@s.whatsapp.net') ? botNumber : botNumber + '@s.whatsapp.net';

    const admins = groupMetadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    if (admins.length === 0) return await reply("⚠️ *No admins found to dismiss.*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");

    // Exclude bot and owner
    const targets = admins.filter(jid => jid !== botJid && jid !== ownerJid);

    if (targets.length === 0) return await reply("✅ *No eligible admins to dismiss (bot and owner excluded).*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");

    await conn.groupParticipantsUpdate(from, targets, "demote");

    await reply(`🚫 *Dismissed Successfully All Admins*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`, { mentions: targets });

  } catch (err) {
    console.error(err);
    await reply("❌ *Failed to dismiss admins. Something went wrong.*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");
  }
});