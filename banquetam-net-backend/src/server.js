const { app } = require("./app");
const { prisma } = require("./lib/prisma");

const PORT = process.env.PORT || 3001;

async function start() {
    await prisma.$connect();
    app.listen(PORT, () => console.log(`✅ http://localhost:${PORT}`));
}

start().catch((e) => {
    console.error("❌ Start error:", e);
    process.exit(1);
});