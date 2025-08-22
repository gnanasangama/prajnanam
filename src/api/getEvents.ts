import { supabase } from "@/lib/supabaseClient";
import { EventModel } from "@/models/Events";

const bucketName = 'event-images'; // your bucket

export async function getEvents(): Promise<EventModel[] | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq('is_visible', true)
    .order('start_time', { ascending: true });

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) return null;

  // Generate signed URLs for each event image
  const eventsWithSignedUrls = await Promise.all(
    data.map(async (event) => {
      if (event.image_url) {
        const pathInBucket = event.image_url.replace(new RegExp(`^${bucketName}/`), '');

        const { data: signedData, error: signError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(pathInBucket, 60 * 60); // 1 hour expiry

        if (signError) {
          console.error("Error creating signed URL:", signError);
          return event; // fallback: keep original path
        }

        return {
          ...event,
          image_url: signedData.signedUrl,
        };
      }
      return event;
    })
  );

  return eventsWithSignedUrls as EventModel[];
}
