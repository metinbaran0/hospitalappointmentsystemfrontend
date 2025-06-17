// utils/timeAgo.ts
export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Daha doğru zaman aralıkları (saniye cinsinden)
    const intervals = {
      yıl: 31536000,    // 365 gün
      ay: 2592000,      // 30 gün (yaklaşık)
      hafta: 604800,    // 7 gün
      gün: 86400,       // 24 saat
      saat: 3600,       // 60 dakika
      dakika: 60,
      saniye: 1
    };
    
    // Önce büyük birimleri kontrol et
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : ''} önce`;
      }
    }
    
    return 'az önce';
  }