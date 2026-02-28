import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://clover-products-service:3002';

// Admin: Add product image by URL
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/admin/products/${params.id}/images/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
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
        console.error('Admin Product Image URL error:', error);
        return NextResponse.json(
            { error: 'Failed to add image URL' },
            { status: 500 }
        );
    }
}
