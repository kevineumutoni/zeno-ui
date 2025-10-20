const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return new Response(JSON.stringify({ error: 'Missing required field: email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(`${baseUrl}/password-reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        errorMessage = await response.json();
      } catch {
        errorMessage = await response.text();
      }
      return new Response(JSON.stringify({ error: "Failed to send password reset email", details: errorMessage }), {
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