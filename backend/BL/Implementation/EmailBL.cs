using MailKit.Net.Smtp;
using EvoPlay.BL.Contract;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System.Net.Mail;
using System.Threading.Tasks;

namespace EvoPlay.BL.Implementation
{
    public class EmailBL : IEmailBL
    {
        public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("your_email@example.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = "איפוס סיסמה";
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = $"<p>לחץ על הקישור הבא לאיפוס הסיסמה שלך:</p><p><a href='{resetLink}'>איפוס סיסמה</a></p>"
            };

            using (var smtp = new MailKit.Net.Smtp.SmtpClient())
            {
                await smtp.ConnectAsync("smtp.example.com", 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("your-email@example.com", "your-password");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
