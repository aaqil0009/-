import { cmd, commands } from '../command.js';
import os from "os";
import config from '../config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "alive",
    desc: "Check uptime and system status",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // ⏳ Initial React
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${secs}s`;
        };

        const uptime = formatUptime(process.uptime());
        const RAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const platform = os.platform();
        const BOT_NAME = config.BOT_NAME || "AAQIL MD";

        // MODERN CYBER / TECH DASHBOARD DESIGN
        const status = `
  🏴 *${BOT_NAME.toUpperCase()}* 🏴

┌───〔 *S Y S T E M  A L I V E* 〕
│
├──▸ 🤖 *sᴛᴀᴛᴜs:* ᴏɴʟɪɴᴇ & ᴀᴄᴛɪᴠᴇ
├──▸ 👤 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME || "AAQIL MD"}
├──▸ ⏱️ *ᴜᴘᴛɪᴍᴇ:* ${uptime}
├──▸ 🖥️ *ʀᴀᴍ:* ${RAM} MB / ${totalRam} GB
├──▸ 📟 *ᴘʟᴀᴛғᴏʀᴍ:* ${platform}
├──▸ 🌐 *ᴍᴏᴅᴇ:* ${config.MODE || "Public"}
│
└───▸

> *🏴 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ 🏴*`;

        await conn.sendMessage(from, { 
            text: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363431150016962@newsletter',
                    newsletterName: BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // ✅ Success React
        await conn.sendMessage(from, { react: { text: '🟢', key: m.key } });

    } catch (e) {
        console.error("Error in alive command:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`❌ *System Error:* ${e.message}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
});
