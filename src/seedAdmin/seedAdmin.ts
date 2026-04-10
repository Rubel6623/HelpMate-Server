import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const name = process.env.NAME!;
  const email = process.env.ADMIN_EMAIL!;
  const phone = process.env.ADMIN_PHONE!;

  const hashedPassword = await bcrypt.hash(adminPassword, 8);

  const adminData = {
    name,
    email,
    phone,
    role: UserRole.ADMIN,
    passwordHash: hashedPassword,
  };

  try {
    const isExists = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isExists) {
      console.log("Admin already exists!!");
      return;
    }
    await prisma.user.create({
      data: adminData,
    });
    console.log("Admin created successfully!!");
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};
seedAdmin();
