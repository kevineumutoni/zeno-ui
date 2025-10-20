const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const { uidb64, token, new_password, confirm_password } = await request.json();

  if (!uidb64 || !token || !new_password || !confirm_password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(`${baseUrl}/password-reset-confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uidb64, token, new_password, confirm_password }),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        errorMessage = await response.json();
      } catch {
        errorMessage = await response.text();
      }
      return new Response(JSON.stringify({ error: "Password reset failed", details: errorMessage }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}