export const SendOtpTemplate = (otp: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Mã OTP của bạn</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333;">Xin chào,</p>
          <p style="font-size: 16px; color: #333;">Đây là mã OTP để xác thực tài khoản của bạn:</p>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            ⏱️ Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.
          </p>
          <p style="color: #666; font-size: 14px;">
            🔒 Vui lòng không chia sẻ mã này với bất kỳ ai.
          </p>
          <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.
          </p>
        </div>
      </div>
    `;
