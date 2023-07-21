import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/common/helpers/crypto';

const prisma = new PrismaClient();

async function manageUsers() {
  const creatorUser = {
    name: 'Criador',
    email: 'criador@afiliados.com',
    phone: '(84) 91111-0000',
    role: Role.CREATOR,
    password: hashPassword('Aa123456789*'),
  };

  const afilliatedUser = {
    name: 'Afiliado',
    email: 'afiliado@afiliados.com',
    phone: '(84) 91111-0000',
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
      await prisma.users.create({
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
