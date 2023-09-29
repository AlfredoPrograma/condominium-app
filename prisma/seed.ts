import { hashPassword } from "../src/utils/encrypt/hashPassword";
import { prisma } from "../src/server/db";

async function seed() {
    const [email, plainPassword] = process.argv.slice(2)

    if (!email || !plainPassword) {
        throw new Error("Email and password are required as arguments")
    }

    const password = await hashPassword(plainPassword)
    await prisma.user.create({
        data: {
            age: 99,
            firstName: "Admin",
            lastName: "Admin",
            identifierCode: "V-ADMIN",
            phoneNumber: "ADMIN",
            emailVerified: new Date(),
            role: "ADMIN",
            isActive: true,
            email,
            password
        }
    })

    await prisma.$disconnect()
}

seed()
    .then(() => console.log("Seed done"))
    .catch(console.log)

