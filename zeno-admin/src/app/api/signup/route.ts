const baseUrl = process.env.BASE_URL;


export async function POST(request: Request) {
   const { first_name, last_name, email, password } = await request.json();
   if (!first_name || !last_name || !email || !password) {
       return new Response(
           JSON.stringify({ error: "Missing required fields. Kindly fill them all." }),
           { status: 400, headers: { "content-type": "application/json" } }
       );
   }
   try {
       const response = await fetch(`${baseUrl}/register/`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ first_name, last_name, email, password })
       });
       if (!response.ok) {
           let errorMessage;
           try {
               errorMessage = await response.json();
           } catch {
               errorMessage = await response.text();
           }
           if (errorMessage?.details?.email?.includes("user with this email already exists.")) {
               return new Response(
                   JSON.stringify({ error: "This email is already registered. Please log in" }),
                   { status: 409, headers: { "content-type": "application/json" } }
               );
           }
           return new Response(
               JSON.stringify({ error: "Failed to sign up. Please try again.", details: errorMessage }),
               { status: response.status, headers: { "content-type": "application/json" } }
           );
       }
       const result = await response.json();
       const responseData = {
           message: result.message,
           role: result.role
       };
       return new Response(JSON.stringify(responseData), {
           status: 200,
           statusText: "User registered successfully",
           headers: { "content-type": "application/json" }
       });
   } catch (error) {
       return new Response(
           JSON.stringify({ error: (error as Error).message }),
           { status: 500, headers: { "content-type": "application/json" } }
       );
   }
}

