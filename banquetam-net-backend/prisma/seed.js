const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    await prisma.room.createMany({
        data: [
            { type: "HALL", title: "Зал" },
            { type: "RESTAURANT", title: "Ресторан" },
            { type: "SUMMER_TERRACE", title: "Летняя веранда" },
            { type: "INDOOR_TERRACE", title: "Закрытая веранда" }
        ],
        skipDuplicates: true
    });

    console.log("✅ Seed done: rooms created");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });