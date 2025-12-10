import { verifyAuthToken } from '../../utils/auth.server';

export async function loader({ request }) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        const result = await verifyAuthToken(token);

        if (result.success) {
            return Response.json({
                success: true,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role
                }
            });
        } else {
            return Response.json({
                success: false,
                error: result.error
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return Response.json({
            success: false,
            error: 'Token verification failed'
        }, { status: 500 });
    }
}
