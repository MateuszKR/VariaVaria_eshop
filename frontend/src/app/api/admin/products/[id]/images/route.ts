import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://clover-products-service:3002';

// Admin: Upload product image file
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Forward the multipart form data directly to the backend
        const formData = await request.formData();

        const response = await fetch(`${BACKEND_URL}/admin/products/${params.id}/images`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                // Do NOT set Content-Type manually for multipart — fetch will set it with boundary
            },
            body: formData,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Backend request failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Admin Product Image Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
