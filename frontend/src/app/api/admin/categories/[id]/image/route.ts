import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const backendUrl = `http://clover-products-service:3002/admin/categories/${id}/image`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData as any,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Backend request failed' }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Admin Category Image POST error:', error);
    return NextResponse.json({ error: 'Failed to upload category image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const backendUrl = `http://clover-products-service:3002/admin/categories/${id}/image`;
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ error: data.error || 'Backend request failed' }, { status: response.status });
    }
    return NextResponse.json({ message: 'Image removed' });
  } catch (error) {
    console.error('Admin Category Image DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove category image' }, { status: 500 });
  }
}


