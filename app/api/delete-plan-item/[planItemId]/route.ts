import { NextResponse } from 'next/server';
import { deletePlanItem } from '@/app/lib/actions';

export async function DELETE(req: Request, { params }: { params: { planItemId: number } }) {
  try {
    const planItemId = params.planItemId;

    if (!planItemId) {
      return NextResponse.json({ error: "Plan item ID is required."}, { status: 400 })
    }

    await deletePlanItem(planItemId);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting plan item:', error);
    return NextResponse.json({ error: 'Failed to delete plan item.' }, { status: 500 });
  }
}
