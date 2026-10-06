import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "delgcstatus",
    alias: ["delgstatus", "delstatus"],
    desc: "Delete group status for everyone. - Powered by AAQIL MD",
    category: "group",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator, isAdmins }) => {

    // ── Owner ya Admin verification ──
    if (!isCreator && !isAdmins) {
        return reply("❌ *This command is only for Group Admins or the Bot Owner!*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");
    }

    try {
        const quotedMsg = m.quoted;

        if (!quotedMsg) {
            return reply("⚠️ *Please reply to the group status or message you want to delete!*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");
        }

        const keyToDelete = {
            remoteJid: from,
            fromMe: quotedMsg.fromMe || false,
            id: quotedMsg.id,
            participant: quotedMsg.sender
        };

        // Message delete trigger
        await conn.sendMessage(from, { delete: keyToDelete });

        return reply("✅ *Status/Message delete request sent!*\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*");

    } catch (error) {
        reply(`❌ *Failed to delete:* ${error.message}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
});