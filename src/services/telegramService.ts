interface TelegramMessage {
  chatId: string;
  messageType: 'daily_digest' | 'roadmap_update' | 'job_alert' | 'milestone_completed';
  data: any;
}

class TelegramService {
  private botToken: string;
  private apiUrl: string;

  constructor() {
    this.botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    if (!this.botToken) {
      throw new Error('Telegram bot token not found in environment variables');
    }
  }

  async sendMessage(message: TelegramMessage): Promise<boolean> {
    try {
      const formattedMessage = this.formatMessage(message);
      
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chatId,
          text: formattedMessage,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  }

  private formatMessage(message: TelegramMessage): string {
    const { messageType, data } = message;

    switch (messageType) {
      case 'daily_digest':
        return `🚀 *NOVA Daily Digest*

📊 *Match Score:* ${data.matchScore}%
📈 *Weekly Change:* ${data.improvement > 0 ? '+' : ''}${data.improvement}%

🎯 *Priority Actions Today:*
${data.actions?.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n') || 'No actions available'}

💼 *New Job Matches:* ${data.newJobs || 0} roles found
🔗 [View Dashboard](${data.dashboardUrl || '#'})`;

      case 'roadmap_update':
        return `🛣️ *Roadmap Progress Update*

✅ *Completed:* ${data.milestoneTitle}
📊 *Score Impact:* +${data.scoreIncrease}%

🎯 *Next Steps:*
${data.nextSteps?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n') || 'No next steps available'}

Keep up the great work! 💪`;

      case 'job_alert':
        return `💼 *New High-Match Job Alert!*

🏢 *${data.jobTitle}* at *${data.companyName}*
💰 $${data.salaryMin}-${data.salaryMax}/hour
📍 ${data.location}
🎯 ${data.matchScore}% match

${data.matchReason || ''}

🔗 [Apply Now](${data.applicationUrl})`;

      case 'milestone_completed':
        return `🎉 *Milestone Achieved!*

✅ ${data.milestoneTitle}
📊 Your match score increased by ${data.scoreIncrease}%

🎯 *Current Score:* ${data.currentScore}%
🚀 *Next Milestone:* ${data.nextMilestone}

Great progress! Keep it up! 💪`;

      default:
        return 'NOVA Career Update';
    }
  }

  async verifyBotToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/getMe`);
      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error verifying Telegram bot token:', error);
      return false;
    }
  }

  // Helper method to get chat ID from username (requires user to start conversation with bot first)
  async getChatId(username: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}/getUpdates`);
      const result = await response.json();
      
      if (result.ok && result.result.length > 0) {
        const update = result.result.find((update: any) => 
          update.message?.from?.username === username
        );
        return update?.message?.chat?.id?.toString() || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting chat ID:', error);
      return null;
    }
  }
}

export const telegramService = new TelegramService();