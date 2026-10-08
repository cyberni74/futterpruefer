"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/auth";
import { revalidateAdmin } from "@/lib/admin/guard";

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidateAdmin();
  return { ok: true, message: read ? "Als gelesen markiert." : "Als ungelesen markiert." };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidateAdmin();
  return { ok: true, message: "Gelöscht." };
}
