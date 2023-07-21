import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/crypto';

const prisma = new PrismaClient();

async function manageUsers() {
  const creatorUser = {
    email: 'criador@afiliados.com',
    role: Role.CREATOR,
    password: hashPassword('Aa123456789*'),
  };

  const afilliatedUser = {
    email: 'afiliado@afiliados.com',
    role: Role.AFFILIATED,
    password: hashPassword('Aa123456789*'),
  };

  const usersToInsert = [creatorUser, afilliatedUser];

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

      if (createdUser.role === Role.AFFILIATED) {
        await prisma.affiliate.create({
          data: {
            name: 'Afiliado Jon',
            userId: createdUser.id,
          },
        });
      } else if (createdUser.role === Role.CREATOR) {
        await prisma.creator.create({
          data: {
            name: 'Criador Jon',
            userId: createdUser.id,
          },
        });
      }
    }
  }
}

async function main() {
  manageUsers();
}

main().finally(async () => {
  await prisma.$disconnect();
});
