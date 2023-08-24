import { hashPassword } from "../src/utils/encrypt/hashPassword";
import { prisma } from "../src/server/db";

async function seed() {
    const password = await hashPassword("ADMIN")
    await prisma.user.create({
        data: {
            email: "admin@admin.com",
            age: 99,
            firstName: "Admin",
            lastName: "Admin",
            identifierCode: "V-ADMIN",
            phoneNumber: "ADMIN",
            emailVerified: new Date(),
            role: "ADMIN",
            isActive: true,
            password
        }
    })

    await prisma.$disconnect()
}

seed()
    .then(() => console.log("Seed done"))
    .catch(console.log)

