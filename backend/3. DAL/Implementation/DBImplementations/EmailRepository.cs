using System.Net;
using System.Net.Mail;
using EvoPlay.Dtos;
using EvoPlay.Repository.Contract;
using System.Threading.Tasks;

namespace EvoPlay.Repository.Implementation
{
    public class EmailRepository : IEmailRepository
    {
        public async Task SendEmailAsync(ContactDto contactDto)
        {
            var fromAddress = new MailAddress("idankashy123@gmail.com", "shmolik");
            var toAddress = new MailAddress("idankashy123@gmail.com", "Recipient Name");
            const string fromPassword = "YourGmailPassword";
            const string subject = "Contact Form Submission";
            string body = $"Name: {contactDto.Name}\nEmail: {contactDto.Email}\nMessage: {contactDto.Message}";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                await smtp.SendMailAsync(message);
            }
        }
    }
}
