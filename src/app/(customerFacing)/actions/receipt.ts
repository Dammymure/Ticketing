export default function generateQrCodeUrl(ticketId: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=${ticketId}`;
}