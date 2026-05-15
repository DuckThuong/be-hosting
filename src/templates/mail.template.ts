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

export const ListingTrialReminderTemplate = (expiresAt: Date) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #111827; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">Goi dung thu sap het han</h1>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #111827;">Xin chao,</p>
          <p style="font-size: 16px; color: #111827;">
            Goi dung thu dang tin cua ban se het han vao ngay
            <strong>${expiresAt.toLocaleDateString('vi-VN')}</strong>.
          </p>
          <p style="font-size: 16px; color: #111827;">
            Vui long mua goi dang tin truoc ngay nay de cac bai dang tiep tuc hien thi.
            Neu chua thanh toan khi trial het han, bai dang se bi xoa mem.
          </p>
        </div>
      </div>
    `;
