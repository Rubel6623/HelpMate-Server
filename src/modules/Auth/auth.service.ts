import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../../../generated/prisma/enums";

interface ILoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

interface IRegisterPayload {
  name: string;
  email?: string;
  phone: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
}

const createUserIntoDB = async (payload: IRegisterPayload) => {
    const hashPassword = await bcrypt.hash(payload.password, 8);

    const result = await prisma.user.create({
      data: { 
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        passwordHash: hashPassword,
        role: payload.role,
        avatarUrl: payload.avatarUrl
      },
    });
    const { passwordHash, ...userWithoutPassword } = result;
    return userWithoutPassword;
};

const loginUserIntoDB = async (payload: ILoginPayload) => {
  let user;
  
  if (payload.email) {
    user = await prisma.user.findUniqueOrThrow({
      where: { email: payload.email },
    });
  } else if (payload.phone) {
    user = await prisma.user.findUniqueOrThrow({
      where: { phone: payload.phone },
    });
  } else {
    throw new Error("Email or Phone is required for login");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    verificationStatus: user.verificationStatus
  }

  const token = jwt.sign(userData, process.env.JWT_SECRET as string, { expiresIn: '1d' });

  return {
    token,
    user: userData
  };
};


const getMeFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      verificationStatus: true,
      createdAt: true,
      runnerProfile: true, // Matching schema
      wallet: {
        select: {
          balance: true
        }
      }
    }
  });
  return result;
};


const updateMeInDB = async (userId: string, payload: Partial<IRegisterPayload>) => {
  // Map fields if necessary
  const updateData: any = { ...payload };
  if (payload.password) {
    updateData.passwordHash = await bcrypt.hash(payload.password, 8);
    delete updateData.password;
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      verificationStatus: true,
      createdAt: true
    }
  });
  return result;
};

export const AuthService = {
  createUserIntoDB,
  loginUserIntoDB,
  getMeFromDB,
  updateMeInDB
};