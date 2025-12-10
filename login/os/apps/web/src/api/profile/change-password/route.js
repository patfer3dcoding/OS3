import { verifyAuthToken, getUserById } from "@/api/utils/auth.server";
import db from "@/api/utils/db.server";

export async function POST(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const authResult = await verifyAuthToken(token);

    if (!authResult.success) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.user.id;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Simple password verification for demo (as per auth.server.js)
    if (user.password_hash !== currentPassword) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 401 },
      );
    }

    // Update password
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newPassword, userId);

    return Response.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return Response.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
