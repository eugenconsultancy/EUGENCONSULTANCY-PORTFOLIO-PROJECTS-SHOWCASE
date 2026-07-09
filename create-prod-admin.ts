import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@eugenconsultancy.com";
  const password = "Admin@2024!"; // Change this to your preferred password
  const passwordHash = await hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: "Eugen Admin",
    },
  });

  console.log("═══════════════════════════════════");
  console.log("✅ Admin Account Ready!");
  console.log("═══════════════════════════════════");
  console.log(`📧 Email:    ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log("═══════════════════════════════════");
  console.log("");
  console.log("Login at:");
  console.log("https://eugenconsultancy-portfolio-projects.vercel.app/admin/login");
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);
