import { User } from "@prisma/client";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
} export function generateHtml(otpCode: number): string {
  return `
      <div style="max-width: 500px; margin: auto; padding: 25px; border-radius: 8px; background-color: #ffffff; font-family: Arial, sans-serif; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); border: 1px solid #eee;">
        <div style="text-align: center;">
          <!-- Agar sizda haqiqiy logo URL bo'lsa shu yerga qo'ying -->
          <img src="https://via.placeholder.com/80?text=San_dev" alt="San_dev Logo" style="width: 80px; margin-bottom: 10px;" />
          <h2 style="color: #2c3e50;">San_dev</h2>
        </div>
        <p style="font-size: 16px; color: #333;">Salom!</p>
        <p style="font-size: 15px; color: #555;">
          Hisobingizni tasdiqlash uchun quyidagi <strong>6 xonali kod</strong>ni kiriting. Kod 5 daqiqa ichida amal qiladi:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #1e90ff;">${otpCode}</span>
        </div>
        <p style="font-size: 14px; color: #888;">Agar bu siz boʻlmasangiz, iltimos bu xabarni e’tiborsiz qoldiring.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} San_dev. Barcha huquqlar himoyalangan.
        </p>
      </div>
    `;
}
export function generateProjectEmail(
  title: string,
  description?: string,
  budget?: number,
  deadline?: Date,
  technologies: string[] = []
): string {
  const techBadges = technologies.length
    ? `<div style="margin-top: 10px;">
         <strong>Technologies:</strong>
         <div style="margin-top: 5px;">
           ${technologies
             .map(
               (tech) =>
                 `<span style="display: inline-block; background-color: #e6f0ff; color: #1e90ff; padding: 5px 10px; border-radius: 15px; font-size: 12px; margin: 3px;">
                    ${tech}
                  </span>`
             )
             .join("")}
         </div>
       </div>`
    : "";

  return `
    <div style="max-width: 600px; margin: auto; padding: 25px; border-radius: 8px; background-color: #ffffff; font-family: Arial, sans-serif; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); border: 1px solid #eee;">
      <div style="text-align: center;">
        <img src="https://via.placeholder.com/80?text=Freelance" alt="Freelance Platform Logo" style="width: 80px; margin-bottom: 10px;" />
        <h2 style="color: #2c3e50;">New Project Available</h2>
      </div>

      <p style="font-size: 16px; color: #333;">Hello Developer,</p>
      <p style="font-size: 15px; color: #555;">
        A new project matching your skills has been posted on <strong>Freelance Platform</strong>:
      </p>

      <div style="margin: 20px 0; padding: 15px; border-radius: 6px; background-color: #f9f9f9; border-left: 5px solid #1e90ff;">
        <h3 style="margin: 0; color: #1e90ff;">${title}</h3>
        ${description ? `<p style="margin: 5px 0 0; font-size: 14px; color: #555;">${description}</p>` : ""}
        ${budget ? `<p style="margin: 10px 0 0; font-size: 14px; color: #333;"><strong>Budget:</strong> $${budget}</p>` : ""}
        ${deadline ? `<p style="margin: 5px 0 0; font-size: 14px; color: #333;"><strong>Deadline:</strong> ${deadline.toDateString()}</p>` : ""}
        ${techBadges}
      </div>

      <p style="font-size: 14px; color: #555;">
        If you are interested, log in to your account and apply now!
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://freelance-platform.com/projects" style="background-color: #1e90ff; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 14px;">
          View Project
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 13px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} Freelance Platform. All rights reserved.
      </p>
    </div>
  `;
}





