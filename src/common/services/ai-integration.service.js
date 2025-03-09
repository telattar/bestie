import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const AIIntegrationService = {
  /**
   * Generates a message using the AI model.
   * @param {string} prompt The prompt to generate the message.
   * @returns {Promise<string>} The generated message
   *
   * */
  async getMessage({ prompt }) {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  },

  /**
   * Gets a motivational message from the AI.
   * @returns {Promise<string>} The generated message.
   */
  async getMotivationalMessage() {
    const prompt = `
      Generate a short, motivational message that will be used in an email.
      It should encourage the recipient to stay positive and keep moving forward.
      Use <p> placeholders to separate the lines.
      Include some emojis.
      Do not mention any headers or sign-offs.
      No friendship or family references or any references of adult activities.
      Tone: Warm, uplifting, and encouraging.  
      Length: 100-150 words.  
      Theme: Personal growth, overcoming challenges, or daily inspiration.  
    `;

    return await this.getMessage({ prompt });
  },

  /**
   * Gets a birthday message from the AI.
   * @returns {Promise<string>} The generated message.
   */
  async getBirthdayMessage() {
    const prompt = `
      Generate a happy birthday message that will be used in an email.
      It should be celebratory and express good wishes for the recipient.
      Use <p> placeholders to separate the lines.
      Include emojis like cake, balloon, party and gifts.
      Do not use hearts or anything that could be interpreted as romantic.
      Do not mention any headers or sign-offs. No friendship or family references.
      No mention of any alcohol or adult activities such as partying.
      No toasting or "here's to another year of" kind of phrases.
      No mention of any gifts or material possessions.
      No mention of gratefullness of celebrating the birthday with the recipient,
      or the recipient's existence on earth.
      Tone: Warm, friendly, and celebratory.  
      Length: approx 100 words.  
      Theme: Celebrating the recipient's special day and wishing them well.  
    `;

    return await this.getMessage({ prompt });
  },
};
