import QRCode from "qrcode";

export async function generateQRCodeDataUrl(token: string, appUrl: string): Promise<string> {
  const verifyUrl = `${appUrl}/ticket/verify?token=${token}`;
  try {
    const dataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: {
        dark: "#0a1929",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (error) {
    console.error("QR generation failed:", error);
    throw new Error("Failed to generate QR code");
  }
}

export async function generateQRCodeBuffer(token: string, appUrl: string): Promise<Buffer> {
  const verifyUrl = `${appUrl}/ticket/verify?token=${token}`;
  return QRCode.toBuffer(verifyUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
  });
}
