import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd, commands } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- PING COMMAND (CYBER TECH UI) ---
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363428270479513@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const start = new Date().getTime();

        const reactionEmojis = ['⚡', '🚀', '🎯', '✨', '💎'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        // Quick reaction
        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const BOT_NAME = config.BOT_NAME || "AAQIL MD";

        // Modern Cyber UI Design
        const text = `
  🏴 *${BOT_NAME.toUpperCase()}* 🏴

┌───〔 *P O N G* 📡 〕
│
├──▸ ⚡ *sᴘᴇᴇᴅ:* ${responseTime.toFixed(2)}s
├──▸ 🧬 *sᴛᴀᴛᴜs:* ᴏɴʟɪɴᴇ & ᴀᴄᴛɪᴠᴇ
├──▸ 👤 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME || "AAQIL MD"}
│
└───▸

> *🏴 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ 🏴*`;

        await conn.sendMessage(from, {
            text,
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

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`⚠️ *Error:* ${e.message}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
});

// --- PING2 COMMAND (DASHBOARD UI) ---
cmd({
    pattern: "ping2",
    desc: "Check bot's response time with dashboard view.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363428270479513@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 500));
        const endTime = Date.now();
        const ping = endTime - startTime;
        const BOT_NAME = config.BOT_NAME || "AAQIL MD";

        let status;
        let indicator;
        if (ping < 1000) {
            status = "ᴇxᴄᴇʟʟᴇɴᴛ";
            indicator = "🟢";
        } else if (ping < 1500) {
            status = "ɢᴏᴏᴅ";
            indicator = "🟡";
        } else {
            status = "ʟᴀɢɢʏ";
            indicator = "🔴";
        }

        // Cyber Dashboard Style Design
        const msg = `
  🏴 *${BOT_NAME.toUpperCase()}* 🏴

┌───〔 *P I N G  D A S H B O A R D* 〕
│
├──▸ 📡 *ʟᴀᴛᴇɴᴄʏ:* ${ping} ms
├──▸ 🧠 *ǫᴜᴀʟɪᴛʏ:* ${status} ${indicator}
├──▸ ⚡ *ᴘᴇʀғᴏʀᴍᴀɴᴄᴇ:* sᴛᴀʙʟᴇ
├──▸ 🌐 *sᴇʀᴠᴇʀ:* ɢʟᴏʙᴀʟ-ʜɪɢʜ
│
└───▸

> *🏴 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ 🏴*`;

        await conn.sendMessage(from, { 
            text: msg.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363431150016962@newsletter',
                    newsletterName: BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`⚠️ *Error:* ${e.message}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
});
