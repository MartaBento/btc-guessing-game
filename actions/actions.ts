import { APIS } from "@/constants/pages-apis-mapping";

export async function userLogin(email: string, password: string) {
  const response = await fetch(APIS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const { error } = errorData;
    throw new Error(error);
  }

  return response.json();
}
