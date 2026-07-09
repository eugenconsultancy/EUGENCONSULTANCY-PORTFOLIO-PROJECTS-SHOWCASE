import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@eugenconsultancy.com";
  const password = "Admin@2024Secure!"; // Change this to your preferred password
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
  console.log("✅ Admin Account Created!");
  console.log("═══════════════════════════════════");
  console.log(`📧 Email:    ${admin.email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`👤 Name:     ${admin.name}`);
  console.log("═══════════════════════════════════");
  console.log("");
  console.log("🔗 Login at: http://localhost:3000/admin/login");
  console.log("   or: https://eugenconsultancy-portfolio-projects.vercel.app/admin/login");
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);
