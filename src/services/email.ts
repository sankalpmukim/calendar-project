const sendEmail = async (to: string, subject: string, message: string) => {
  const response = await fetch(`https://email.sankalpmukim.dev/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      subject,
      message,
    }),
  });
  return response.ok;
};

export const sendEmailVerification = async (
  to: string,
  verificationSecret: string
) => {
  try {
    if (!process.env.SITE_URL) {
      throw new Error("SITE_URL is not set");
    }

    const subject = "Verify your email";
    const message = `Click the link below to verify your email:
  ${process.env.SITE_URL}/auth/verify-email?secret=${verificationSecret}`;
    return sendEmail(to, subject, message);
  } catch (error) {
    console.error(error);
    return false;
  }
};
