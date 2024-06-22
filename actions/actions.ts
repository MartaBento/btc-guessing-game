import { APIS } from "@/constants/pages-apis-mapping";
import { User } from "@/types/global-types";

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

export async function getUser(userId?: number, email?: string): Promise<User> {
  const response = await fetch(
    `${APIS.GET_USER}?${userId ? `userId=${userId}` : `email=${email}`}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const { error } = errorData;
    throw new Error(error);
  }

  return response.json();
}
