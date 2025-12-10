import { authenticateUser } from '../../utils/auth.server';

export async function action({ request }) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { email, password } = await request.json();
        const result = await authenticateUser(email, password);

        if (result.success) {
            return Response.json({
                success: true,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role
                },
                token: result.token
            });
        } else {
            return Response.json({
                success: false,
                error: result.error
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return Response.json({
            success: false,
            error: 'Login failed'
        }, { status: 500 });
    }
}
