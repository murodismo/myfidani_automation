const TelegramBot = require('node-telegram-bot-api');

/**
 * HTML teglarini Telegram formatiga moslab tozalash (Escape)
 */
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

/**
 * Custom Playwright Reporter - Detalli Bug Reportlar (Tozalangan variant)
 */
class TelegramReporter {
  constructor(options = {}) {
    this.token = options.token || process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = options.chatId || process.env.TELEGRAM_CHAT_ID;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.testDetails = [];
  }

  onTestEnd(test, result) {
    const detail = {
      title: test.title,
      status: result.status,
      duration: (result.duration / 1000).toFixed(2),
      location: `${test.location.file.split(/[\\/]/).pop()}:${test.location.line}`,
      fullError: result.error ? result.error.message : null,
      expected: null,
      actual: null,
      steps: result.steps.map(s => {
        const icon = s.category === 'test.step' ? (s.error ? '❌' : '✅') : '🔹';
        return `${icon} ${escapeHTML(s.title)}`;
      }).join('\n')
    };

    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'skipped') {
      this.skipped++;
    } else {
      this.failed++;
      if (result.error) {
        const msg = result.error.message || '';
        const expectedMatch = msg.match(/Expected: (.*)/);
        const receivedMatch = msg.match(/Received: (.*)/) || msg.match(/Actual: (.*)/);
        detail.expected = expectedMatch ? expectedMatch[1].trim() : "Nomalum";
        detail.actual = receivedMatch ? receivedMatch[1].trim() : "Nomalum";
      }
    }
    this.testDetails.push(detail);
  }

  async onEnd(result) {
    if (!this.token || !this.chatId) return;
    const bot = new TelegramBot(this.token, { polling: false });

    // 1-XABAR: UMUMIY STATISTIKA
    const overallIcon = result.status === 'passed' ? '✅' : '❌';
    let summary = `🚀 <b>PLAYWRIGHT TEST SUMMARY</b>\n`;
    summary += `━━━━━━━━━━━━━━━━━━━━\n`;
    summary += `📂 <b>Status:</b> ${overallIcon} ${result.status.toUpperCase()}\n`;
    summary += `⏱ <b>Duration:</b> ${(result.duration / 1000).toFixed(2)}s\n\n`;

    summary += `📝 <b>TEST CASES:</b>\n`;
    this.testDetails.forEach((t, i) => {
      const icon = t.status === 'passed' ? '✅' : t.status === 'skipped' ? '⚪' : '❌';
      summary += `${i + 1}. ${icon} ${escapeHTML(t.title)} (${t.duration}s)\n`;
    });

    summary += `\n📊 <b>STATISTICS:</b>\n`;
    summary += `✅ Passed: <b>${this.passed}</b>\n`;
    summary += `❌ Failed: <b>${this.failed}</b>\n`;
    summary += `⚪ Skipped: <b>${this.skipped}</b>\n`;
    summary += `━━━━━━━━━━━━━━━━━━━━`;

    try {
      await bot.sendMessage(this.chatId, summary, { parse_mode: 'HTML' });
    } catch (e) {
      console.error('Statistika error:', e.message);
    }

    // 2-XABARLAR: HAR BIR FAIL UCHUN ALOHIDA DETALLI BUG REPORT
    for (const t of this.testDetails) {
      if (t.status === 'failed' || t.status === 'timedOut') {
        let bugReport = `🚨 <b>DETAILED BUG REPORT</b>\n`;
        bugReport += `━━━━━━━━━━━━━━━━━━━━\n`;
        bugReport += `🏷 <b>Title:</b> <i>${escapeHTML(t.title)}</i>\n`;
        bugReport += `📍 <b>File:</b> <code>${escapeHTML(t.location)}</code>\n\n`;
        
        if (t.steps) {
          bugReport += `👣 <b>Steps Executed:</b>\n${t.steps}\n\n`;
        }
        
        bugReport += `📥 <b>Expected Result:</b>\n<code>${escapeHTML(t.expected) || 'Nomalum'}</code>\n\n`;
        bugReport += `📤 <b>Actual Result:</b>\n<code>${escapeHTML(t.actual) || 'Nomalum'}</code>\n\n`;
        
        const safeError = t.fullError ? escapeHTML(t.fullError.substring(0, 1500)) : 'No error message';
        bugReport += `⚠️ <b>Full Error:</b>\n<pre>${safeError}</pre>\n`;
        bugReport += `━━━━━━━━━━━━━━━━━━━━`;

        try {
          await bot.sendMessage(this.chatId, bugReport, { parse_mode: 'HTML' });
        } catch (e) {
          console.error('Bug report error:', e.message);
          // Agar HTML xato bo'lsa, oddiy matn sifatida qayta jo'natamiz
          const plainMsg = `🚨 BUG: ${t.title}\nERROR: ${t.fullError ? t.fullError.substring(0, 200) : ''}`;
          await bot.sendMessage(this.chatId, plainMsg).catch(() => {});
        }
      }
    }
    
    console.log('\n✅ Batafsil reportlar Telegramga yuborildi.');
  }
}

module.exports = TelegramReporter;
