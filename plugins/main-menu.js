import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import os from "os";
import fs from 'fs';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.toLowerCase().split('').map(char => smallCapsMap[char] || char).join('');
};

// --- ELEGANT LINE-DIVIDER CATEGORY DESIGN ---
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return ''; 
    
    let header = `\n─────── ❖ *${toSmallCaps(category).toUpperCase()}* ───────\n\n`;
    let body = validCmds.map(cmd => `  ✦ .${toSmallCaps(cmd.pattern)}`).join('\n');
    let footer = `\n`;
    
    return `${header}${body}${footer}`;
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu"],
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTERS ---
        try {
            const newslettersToUnfollow = [
                '120363409040641272@newsletter',
                '120363428270479513@newsletter'
            ];

            for (const newsletterJid of newslettersToUnfollow) {
                await conn.newsletterUnfollow(newsletterJid);
            }
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(Boolean);
        let menuSections = '';
        categories.forEach(cat => {
            const catCmds = Object.values(commands).filter(c => c.category === cat);
            menuSections += formatCategory(cat, catCmds);
        });

        // Config variables setup
        const botName = config.BOT_NAME || "AAQIL MD";
        const ownerName = config.OWNER_NAME || "Aaqil";
        const uptime = runtime(process.uptime());
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        // --- LINE-DIVIDER MENU DASHBOARD ---
        let dec = `
👑 *${botName.toUpperCase()}* 👑

──────── *SYSTEM INFO* ────────

👤 *Owner:* ${ownerName}
🤖 *Bot Name:* ${botName}
⚡ *Uptime:* ${uptime}
📌 *Commands:* ${Object.keys(commands).length}
🌐 *Mode:* ${config.MODE || "Public"}
💻 *RAM:* ${ramUsed} MB / ${totalRam} GB
${menuSections}
───────────────────────────────
> *✨ Powered by ${botName} ✨*`;

        // Image URL Selection (Fallback set to requested catbox link)
        let imageToUse = config.BOT_IMAGE || "https://files.catbox.moe/utq5vt.jpg";

        // Menu Image Message
        await conn.sendMessage(from, { 
            image: { url: imageToUse },
            caption: dec, 
            contextInfo: { 
                mentionedJid: [m.sender], 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363431150016962@newsletter', 
                    newsletterName: botName, 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: mek });

    } catch (e) { 
        const botName = config.BOT_NAME || "AAQIL MD";
        reply(`❌ *Error:* ${e.message}\n\n*_Powered by ${botName}_*`); 
    } 
});
