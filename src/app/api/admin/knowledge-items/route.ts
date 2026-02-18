import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      content,
      community,
      category,
      type,
      subtype,
      is_visible,
      sequence,
      media,
    } = body;

    // Validate required fields
    if (!title || !content || !community || !category || !type) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabase.from('knowledge_items').insert({
      title,
      content,
      community,
      category,
      type,
      subtype: subtype || null,
      is_visible: is_visible !== false,
      sequence: sequence || null,
      media: media || null,
      zone: null,
    });

    if (error) throw error;

    return Response.json(
      { message: 'Knowledge item created successfully', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create knowledge item:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create knowledge item' },
      { status: 500 }
    );
  }
}
