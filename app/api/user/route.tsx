import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { name, email } = await req.json();

  //   check
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (users?.length == 0) {
    const result = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        subscriptionId: usersTable.subscriptionId,
      });

    console.log(result);

    return NextResponse.json(result);
  }

  return NextResponse.json(users[0]);
}
