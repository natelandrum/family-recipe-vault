import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_URL: process.env.CLOUDINARY_URL
});

export async function POST(request: NextRequest): Promise<NextResponse> {
    const data = await request.json();
    const { file } = data;

    try {
        const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
            upload_preset: 'ml_default',
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}