import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    // 1. Seed Super Admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPhone = process.env.SUPER_ADMIN_PHONE;
    
    if (!superAdminEmail || !superAdminPhone) {
      console.log("Skipping Super Admin seeding: Email or Phone not found in .env");
    } else {
      const superAdminExists = await prisma.user.findFirst({
        where: {
          OR: [
            { email: superAdminEmail },
            { phone: superAdminPhone }
          ]
        },
      });

      if (!superAdminExists) {
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD!;
        const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 8);

        await prisma.user.create({
          data: {
            name: process.env.SUPER_ADMIN_NAME!,
            email: superAdminEmail,
            phone: superAdminPhone,
            role: UserRole.SUPERADMIN,
            passwordHash: superAdminHashedPassword,
          },
        });
        console.log("Super Admin created successfully!!");
      } else {
        console.log("Super Admin already exists (matched email or phone)!!");
      }
    }

    // 2. Seed Standard Admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPhone = process.env.ADMIN_PHONE;

    if (!adminEmail || !adminPhone) {
      console.log("Skipping Admin seeding: Email or Phone not found in .env");
    } else {
      const adminExists = await prisma.user.findFirst({
        where: {
          OR: [
            { email: adminEmail },
            { phone: adminPhone }
          ]
        },
      });

      if (!adminExists) {
        const adminPassword = process.env.ADMIN_PASSWORD!;
        const adminHashedPassword = await bcrypt.hash(adminPassword, 8);

        await prisma.user.create({
          data: {
            name: process.env.NAME!,
            email: adminEmail,
            phone: adminPhone,
            role: UserRole.ADMIN,
            passwordHash: adminHashedPassword,
          },
        });
        console.log("Admin created successfully!!");
      } else {
        console.log("Admin already exists (matched email or phone)!!");
      }
    }
  } catch (error) {
    console.log("Error seeding admin tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
