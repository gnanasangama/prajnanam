import { getAdminCommunityKnowledgeMetrics } from '@/api/admin/getMetrics';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const metrics = await getAdminCommunityKnowledgeMetrics(id);
    return Response.json(metrics);
  } catch (error) {
    console.error('Failed to fetch admin community metrics:', error);
    return Response.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
