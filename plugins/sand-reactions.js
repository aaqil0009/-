import { cmd } from '../command.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath.path);

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function fetchGif(url) {
    try {
        const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'image/webp,image/*,*/*;q=0.8'
            },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching GIF:", error.message);
        throw new Error("Could not fetch GIF.");
    }
}

async function gifToVideo(gifBuffer) {
    const filename = crypto.randomBytes(6).toString('hex');
    const gifPath = path.join(tmpdir(), `${filename}.gif`);
    const mp4Path = path.join(tmpdir(), `${filename}.mp4`);

    fs.writeFileSync(gifPath, gifBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(gifPath)
            .outputOptions([
                "-movflags faststart",
                "-pix_fmt yuv420p",
                "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
            ])
            .on("error", (err) => {
                console.error("❌ ffmpeg conversion error:", err);
                reject(new Error("Could not process GIF to video."));
            })
            .on("end", resolve)
            .save(mp4Path);
    });

    const videoBuffer = fs.readFileSync(mp4Path);
    fs.unlinkSync(gifPath);
    fs.unlinkSync(mp4Path);

    return videoBuffer;
}

async function getNekosGif(action) {
    try {
        const apiUrl = `https://nekos.best/api/v2/${action}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            },
            timeout: 10000
        });
        return response.data.results[0].url;
    } catch (error) {
        console.log('⚠️ Nekos.Best failed, trying NekoAPI...');
        const apiUrl = `https://nekos.life/api/v2/img/${action}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        return response.data.url;
    }
}

cmd({
    pattern: "lurk",
    desc: "Send a lurk reaction GIF.",
    category: "fun",
    react: "👀",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is lurking @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is lurking everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("lurk");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .lurk command:", error);
        reply(`❌ *Error in .lurk command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "shoot",
    desc: "Send a shoot reaction GIF.",
    category: "fun",
    react: "🔫",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} shot @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} shot everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("shoot");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .shoot command:", error);
        reply(`❌ *Error in .shoot command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "sleep",
    desc: "Send a sleep reaction GIF.",
    category: "fun",
    react: "😴",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is sleeping with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is sleeping!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("sleep");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .sleep command:", error);
        reply(`❌ *Error in .sleep command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "clap",
    desc: "Send a clap reaction GIF.",
    category: "fun",
    react: "👏",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} clapped for @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} clapped for everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("clap");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .clap command:", error);
        reply(`❌ *Error in .clap command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "shrug",
    desc: "Send a shrug reaction GIF.",
    category: "fun",
    react: "🤷",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} shrugged at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} shrugged at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("shrug");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .shrug command:", error);
        reply(`❌ *Error in .shrug command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "stare",
    desc: "Send a stare reaction GIF.",
    category: "fun",
    react: "👀",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is staring at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is staring at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("stare");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .stare command:", error);
        reply(`❌ *Error in .stare command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "wave",
    desc: "Send a wave reaction GIF.",
    category: "fun",
    react: "👋",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} waved at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is waving at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("wave");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .wave command:", error);
        reply(`❌ *Error in .wave command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "poke",
    desc: "Send a poke reaction GIF.",
    category: "fun",
    react: "👉",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} poked @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} poked everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("poke");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .poke command:", error);
        reply(`❌ *Error in .poke command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "confused",
    desc: "Send a confused reaction GIF.",
    category: "fun",
    react: "😕",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is confused by @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is confused!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("confused");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .confused command:", error);
        reply(`❌ *Error in .confused command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "smile",
    desc: "Send a smile reaction GIF.",
    category: "fun",
    react: "😁",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} smiled at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is smiling at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("smile");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .smile command:", error);
        reply(`❌ *Error in .smile command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "peck",
    desc: "Send a peck reaction GIF.",
    category: "fun",
    react: "🐦",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} pecked @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} pecked everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("peck");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .peck command:", error);
        reply(`❌ *Error in .peck command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "wink",
    desc: "Send a wink reaction GIF.",
    category: "fun",
    react: "😉",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} winked at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is winking at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("wink");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .wink command:", error);
        reply(`❌ *Error in .wink command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "sip",
    desc: "Send a sip reaction GIF.",
    category: "fun",
    react: "☕",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is sipping with @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is sipping!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("sip");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .sip command:", error);
        reply(`❌ *Error in .sip command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "blush",
    desc: "Send a blush reaction GIF.",
    category: "fun",
    react: "😊",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is blushing at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is blushing!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("blush");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .blush command:", error);
        reply(`❌ *Error in .blush command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "smug",
    desc: "Send a smug reaction GIF.",
    category: "fun",
    react: "😏",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is smug at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is feeling smug!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("smug");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .smug command:", error);
        reply(`❌ *Error in .smug command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "tickle",
    desc: "Send a tickle reaction GIF.",
    category: "fun",
    react: "🤣",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} tickled @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} tickled everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("tickle");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .tickle command:", error);
        reply(`❌ *Error in .tickle command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "yeet",
    desc: "Send a yeet reaction GIF.",
    category: "fun",
    react: "💨",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} yeeted @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is yeeting everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("yeet");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .yeet command:", error);
        reply(`❌ *Error in .yeet command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "think",
    desc: "Send a think reaction GIF.",
    category: "fun",
    react: "🤔",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is thinking about @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is thinking!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("think");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .think command:", error);
        reply(`❌ *Error in .think command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "highfive",
    desc: "Send a high-five reaction GIF.",
    category: "fun",
    react: "✋",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} gave a high-five to @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is high-fiving everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("highfive");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .highfive command:", error);
        reply(`❌ *Error in .highfive command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "feed",
    desc: "Send a feed reaction GIF.",
    category: "fun",
    react: "🍕",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} is feeding @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is feeding everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("feed");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .feed command:", error);
        reply(`❌ *Error in .feed command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "wag",
    desc: "Send a wag reaction GIF.",
    category: "fun",
    react: "🐕",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} wagged at @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} wagged at everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("wag");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer = await gifToVideo(gifBuffer);
        
        await conn.sendMessage(
            mek.chat,
            { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
            { quoted: mek }
        );
    } catch (error) {
        console.error("❌ Error in .wag command:", error);
        reply(`❌ *Error in .wag command:*\n\`\`\`${error.message}\`\`\``);
    }
});

cmd({
    pattern: "bite",
    desc: "Send a bite reaction GIF.",
    category: "fun",
    react: "🦷",
    filename: __filename,
    use: "@tag (optional)",
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        let sender = `@${mek.sender.split("@")[0]}`;
        let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
        let isGroup = m.isGroup;

        let message = mentionedUser
            ? `${sender} bit @${mentionedUser.split("@")[0]}`
            : isGroup
            ? `${sender} is biting everyone!`
            : `> © Powered By 𝘼𝘼𝙌𝙄𝙇 🖤`;

        let gifUrl = await getNekosGif("bite");
        let gifBuffer = await fetchGif(gifUrl);
        let videoBuffer =