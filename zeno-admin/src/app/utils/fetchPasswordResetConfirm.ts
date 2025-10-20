const baseUrl = '/api/password-reset-confirm';

export async function fetchPasswordResetConfirm(
  uidb64: string,
  token: string,
  newPassword: string,
  confirmPassword: string
) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uidb64,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Something went wrong: " + errorText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to reset password; ' + (error as Error).message);
  }
}