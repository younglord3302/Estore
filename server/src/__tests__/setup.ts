import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Reset database before tests
  execSync("npx prisma migrate reset --force --skip-generate", {
    stdio: "inherit",
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
