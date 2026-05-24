export interface sendEmailOptions {
  sender: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  html_body?: string;
  text_body?: string;
  custom_headers?: Record<string, any>[];
  attachments?: Record<string, any>[];
  inlines?: Record<string, any>[];
  template_id?: string;
  template_data?: Record<string, string>;
}

export class SMTP2GOClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(options: sendEmailOptions) {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": this.apiKey,
      },
      body: JSON.stringify(options),
    });
    console.log("SMTP2GO API response:", await response.json());
    return response;
  }
}

const smtp2goClient = new SMTP2GOClient(process.env.SMTP2GO_API_KEY || "");

export default smtp2goClient;
