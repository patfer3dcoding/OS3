import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function action({ request }) {
    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json(
                { error: 'No file received' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const url = `/uploads/${filename}`;

        return Response.json({ url, success: true });
    } catch (error) {
        console.error('Error uploading file:', error);
        return Response.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
