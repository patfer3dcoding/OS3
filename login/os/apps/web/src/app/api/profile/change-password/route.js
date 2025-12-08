import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { hash as argonHash, verify as argonVerify } from "argon2";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const userId = session.user.id;

    // Get current password hash
    const accountResult = await sql`
      SELECT password FROM auth_accounts 
      WHERE "userId" = ${userId} AND type = 'credentials'
    `;

    if (accountResult.length === 0) {
      return Response.json({ error: "Account not found" }, { status: 404 });
    }

    const currentHash = accountResult[0].password;

    // Verify current password
    const isValid = await argonVerify(currentHash, currentPassword);

    if (!isValid) {
      return Response.json(
        { error: "Current password is incorrect" },
        { status: 401 },
      );
    }

    // Hash new password
    const newHash = await argonHash(newPassword);

    // Update password
    await sql`
      UPDATE auth_accounts 
      SET password = ${newHash}
      WHERE "userId" = ${userId} AND type = 'credentials'
    `;

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
