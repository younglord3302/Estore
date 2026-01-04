import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "Regular User",
      role: "USER",
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      name: "Electronics",
      description: "Electronic devices and gadgets",
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: "Clothing" },
    update: {},
    create: {
      name: "Clothing",
      description: "Fashion and apparel",
    },
  });

  const books = await prisma.category.upsert({
    where: { name: "Books" },
    update: {},
    create: {
      name: "Books",
      description: "Books and literature",
    },
  });

  // Create products
  const products = [
    {
      name: "iPhone 15",
      description: "Latest iPhone with advanced features",
      price: 999.99,
      imageUrl: "https://example.com/iphone15.jpg",
      stock: 50,
      categoryId: electronics.id,
    },
    {
      name: "MacBook Pro",
      description: "Powerful laptop for professionals",
      price: 1999.99,
      imageUrl: "https://example.com/macbook.jpg",
      stock: 25,
      categoryId: electronics.id,
    },
    {
      name: "Wireless Headphones",
      description: "High-quality wireless headphones",
      price: 199.99,
      imageUrl: "https://example.com/headphones.jpg",
      stock: 100,
      categoryId: electronics.id,
    },
    {
      name: "Cotton T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: 29.99,
      imageUrl: "https://example.com/tshirt.jpg",
      stock: 200,
      categoryId: clothing.id,
    },
    {
      name: "Jeans",
      description: "Classic blue jeans",
      price: 79.99,
      imageUrl: "https://example.com/jeans.jpg",
      stock: 150,
      categoryId: clothing.id,
    },
    {
      name: "Programming Book",
      description: "Learn to code with this comprehensive guide",
      price: 49.99,
      imageUrl: "https://example.com/book.jpg",
      stock: 75,
      categoryId: books.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
