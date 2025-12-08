export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate credentials
    if (email === "admin@admin.com" && password === "password123") {
      // Create a simple session token
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

      return Response.json({
        success: true,
        token,
        user: {
          email: "admin@admin.com",
          name: "Admin User",
          role: "admin",
        },
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 },
    );
  }
}
