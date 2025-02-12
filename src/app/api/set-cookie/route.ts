import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Exemplo de requisição para definir um cookie de autenticação

// const handleSetAuthToken = async () => {
//   await fetch("/api/set-cookie", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       key: "auth_token",
//       value: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb290IiwiaWF0IjoxNzM5MzExNzMyLCJleHAiOjE3MzkzMTM1MzJ9.U3iMACfccMAsi-1_88GsHw_f0g3vM1GfQXVbIdAzzPk",
//       options: {
//         httpOnly: true,
//         secure: true,
//         sameSite: "Strict",
//         maxAge: 60 * 60 * 24,
//       },
//     }),
//   });
// };

export async function POST(request: Request) {
  const { key, value, options } = await request.json();

  if (!key || !value) {
    return new NextResponse("Key e Value são obrigatórios", { status: 400 });
  }

  cookies().set(key, value, {
    path: "/",
    httpOnly: options?.httpOnly ?? true,
    secure: options?.secure ?? process.env.NODE_ENV === "production",
    sameSite: options?.sameSite ?? "Strict",
    maxAge: options?.maxAge ?? 60 * 60 * 24 * 30,
  });

  return new NextResponse(`Cookie '${key}' definido com sucesso`, { status: 200 });
}
