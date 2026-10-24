import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const DEFAULT_SERVICES = [
  {
    name: "Luxury Keratin Hair Spa & Treatment",
    category: "Hair",
    price: 85,
    duration: 75,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Deep restorative botanical infusion with steam therapy, scalp massage, and organic keratin smoothing for silky, frizz-free locks.",
    isActive: true
  },
  {
    name: "Radiance Rose Glow Facial",
    category: "Skincare",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    description: "Revitalizing botanical facial with rosewater mist, micro-exfoliation, vitamin C serum, and lymphatic drainage facial massage.",
    isActive: true
  },
  {
    name: "Deluxe Gel Manicure & Hand Spa",
    category: "Nail Care",
    price: 45,
    duration: 45,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    description: "Soothing warm almond oil hand soak, cuticle care, hand scrub, massage, and long-lasting non-chip gel polish with UV finish.",
    isActive: true
  },
  {
    name: "Balayage & Precision Haircut",
    category: "Hair",
    price: 135,
    duration: 120,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Customized hand-painted balayage highlights customized to your skin undertones, followed by a precision cut, blow-dry, and glossing toner.",
    isActive: true
  },
  {
    name: "Bridal & Glamour Party Makeup",
    category: "Makeup",
    price: 95,
    duration: 60,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    description: "Flawless HD airbrush makeup with custom lash application, contouring, and long-lasting setting finish for weddings or special events.",
    isActive: true
  },
  {
    name: "Signature Spa Pedicure with Hot Stone",
    category: "Nail Care",
    price: 55,
    duration: 50,
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
    description: "Herbal foot bath, eucalyptus salt scrub, calluses smoothing, warm basalt stones massage, and designer gel polish application.",
    isActive: true
  }
];

const seedData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('❌ Could not connect to MongoDB. Aborting seeding.');
      process.exit(1);
    }

    console.log('🌸 Starting database seed...');

    // 1. Seed Admin User if not already present
    const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@glamourhaven.com').toLowerCase().trim();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPass2026!';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: process.env.DEFAULT_ADMIN_NAME || 'Salon Administrator',
        email: adminEmail,
        passwordHash,
        role: 'admin'
      });
      console.log(`✅ Default Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin user (${adminEmail}) already exists. Skipping.`);
    }

    // 2. Seed Default Salon Services if none exist
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      console.log(`✅ Seeded ${DEFAULT_SERVICES.length} default salon services.`);
    } else {
      console.log(`ℹ️  Database already contains ${serviceCount} services. Skipping service seeding.`);
    }

    console.log('🎉 Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
