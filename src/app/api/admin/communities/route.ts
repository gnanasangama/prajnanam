import { getAdminCommunities } from '@/api/admin/getCommunities';

export async function GET() {
  try {
    const communities = await getAdminCommunities();
    return Response.json(communities);
  } catch (error) {
    console.error('Failed to fetch admin communities:', error);
    return Response.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}
