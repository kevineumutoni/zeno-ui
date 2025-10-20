const BASE_URL = process.env.BASE_URL;

export async function GET(request: Request) {
  const token = request.headers.get("Authorization");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!BASE_URL) {
    return new Response("Not configured", { status: 500 })
  }

  if (!token || !id){
    return new Response("Missing token or id", { status: 401 })
  }

  try {
    const response = await fetch(`${BASE_URL}/users/${id}/`, {
      method: "GET",
      headers: { Authorization: token, "Content-Type": "application/json" },
      cache: "no-store",
    });
   const data = await response.text();
    return new Response(data, { status: response.status });
  } 
  catch (error) {
    const message = (error as Error).message || 'An error occurred while retrieving data.';
    return new Response(message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const token = request.headers.get("Authorization");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!BASE_URL){ 
    return new Response("Not configured", { status: 500 })
  }

  if (!token || !id){
    return new Response("Missing token or id", { status: 401 })
  }

  try {
    const body = await request.text();
    const response = await fetch(`${BASE_URL}/users/${id}/`, {
      method: "PUT",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const data = await response.text();
    return new Response(data, { status: response.status });
  }
   catch (error) {
    const message = (error as Error).message || 'An error occurred while updating data.';
    return new Response(message, { status: 500 });
  }
}