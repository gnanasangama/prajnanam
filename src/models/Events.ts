export interface EventModel {
  id: string;
  title: string; // e.g., { en: "Event Title", kn: "ಕಾರ್ಯಕ್ರಮ ಶೀರ್ಷಿಕೆ" }
  content: string; // e.g., { en: "Description", kn: "ವಿವರಣೆ" }
  organizer: string;
  event_type: 'online' | 'offline';
  category: 'book_release' | 'samvaada';
  cta_label: string;
  cta_link: string;
  image_url: string;
  is_visible: boolean;
  start_time: string; // ISO format
  end_time?: string | null;
  created_at: string;
  updated_at: string;
}
