const baseUrl = '/api/password-reset';

export async function fetchPasswordReset(email: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Something went wrong: " + errorText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to send password reset email; ' + (error as Error).message);
  }
}