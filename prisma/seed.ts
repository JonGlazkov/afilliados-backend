import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/crypto';

const prisma = new PrismaClient();

async function manageUsers() {
  const admin = {
    email: 'admin@afiliados.com',
    password: hashPassword('Aa123456789*'),
  };

  const usersToInsert = [admin];

  for (const user of usersToInsert) {
    const doesItExist = await prisma.users.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!doesItExist) {
      const createdUser = await prisma.users.create({
        data: user,
      });
    }
  }
}

async function main() {
  manageUsers();
}

main().finally(async () => {
  await prisma.$disconnect();
});
