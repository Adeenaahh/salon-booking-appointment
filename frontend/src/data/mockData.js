/**
 * STAGE 2 SAMPLE DISPLAY DATA
 * Note: This is client-side mock data used exclusively for the Stage 2 Frontend preview.
 * In Stage 3 to 5, this will be completely replaced with real MongoDB Atlas data via the Express API.
 */

export const INITIAL_SERVICES = [
  {
    id: "srv-001",
    name: "Luxury Keratin Hair Spa & Treatment",
    category: "Hair",
    price: 85,
    duration: 75, // in minutes
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Deep restorative botanical infusion with steam therapy, scalp massage, and organic keratin smoothing for silky, frizz-free locks.",
    isActive: true
  },
  {
    id: "srv-002",
    name: "Radiance Rose Glow Facial",
    category: "Skincare",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    description: "Revitalizing botanical facial with rosewater mist, micro-exfoliation, vitamin C serum, and lymphatic drainage facial massage.",
    isActive: true
  },
  {
    id: "srv-003",
    name: "Deluxe Gel Manicure & Hand Spa",
    category: "Nail Care",
    price: 45,
    duration: 45,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    description: "Soothing warm almond oil hand soak, cuticle care, hand scrub, massage, and long-lasting non-chip gel polish with UV finish.",
    isActive: true
  },
  {
    id: "srv-004",
    name: "Balayage & Precision Haircut",
    category: "Hair",
    price: 135,
    duration: 120,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Customized hand-painted balayage highlights customized to your skin undertones, followed by a precision cut, blow-dry, and glossing toner.",
    isActive: true
  },
  {
    id: "srv-005",
    name: "Bridal & Glamour Party Makeup",
    category: "Makeup",
    price: 95,
    duration: 60,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    description: "Flawless HD airbrush makeup with custom lash application, contouring, and long-lasting setting finish for weddings or special events.",
    isActive: true
  },
  {
    id: "srv-006",
    name: "Signature Spa Pedicure with Hot Stone",
    category: "Nail Care",
    price: 55,
    duration: 50,
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
    description: "Herbal foot bath, eucalyptus salt scrub, calluses smoothing, warm basalt stones massage, and designer gel polish application.",
    isActive: true
  }
];

export const SALON_TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM"
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-101",
    customerId: "usr-cust-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.jenkins@example.com",
    serviceId: "srv-001",
    serviceName: "Luxury Keratin Hair Spa & Treatment",
    servicePrice: 85,
    appointmentDate: "2026-10-26",
    startTime: "10:00 AM",
    status: "confirmed",
    notes: "Has mild sensitivity to strong fragrances.",
    createdAt: "2026-10-24T10:15:00Z"
  },
  {
    id: "apt-102",
    customerId: "usr-cust-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.jenkins@example.com",
    serviceId: "srv-002",
    serviceName: "Radiance Rose Glow Facial",
    servicePrice: 65,
    appointmentDate: "2026-10-29",
    startTime: "02:00 PM",
    status: "pending",
    notes: "First time trying this facial.",
    createdAt: "2026-10-24T12:00:00Z"
  },
  {
    id: "apt-103",
    customerId: "usr-cust-2",
    customerName: "Emma Watson",
    customerEmail: "emma.watson@example.com",
    serviceId: "srv-004",
    serviceName: "Balayage & Precision Haircut",
    servicePrice: 135,
    appointmentDate: "2026-10-27",
    startTime: "11:00 AM",
    status: "confirmed",
    notes: "Prefers warm honey blonde tones.",
    createdAt: "2026-10-23T16:30:00Z"
  },
  {
    id: "apt-104",
    customerId: "usr-cust-3",
    customerName: "Jessica Alba",
    customerEmail: "jessica.alba@example.com",
    serviceId: "srv-003",
    serviceName: "Deluxe Gel Manicure & Hand Spa",
    servicePrice: 45,
    appointmentDate: "2026-10-25",
    startTime: "04:00 PM",
    status: "rejected",
    notes: "Requested past closing hours.",
    createdAt: "2026-10-22T09:00:00Z"
  },
  {
    id: "apt-105",
    customerId: "usr-cust-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.jenkins@example.com",
    serviceId: "srv-005",
    serviceName: "Bridal & Glamour Party Makeup",
    servicePrice: 95,
    appointmentDate: "2026-10-20",
    startTime: "03:00 PM",
    status: "cancelled",
    notes: "Customer cancelled due to travel.",
    createdAt: "2026-10-18T14:20:00Z"
  }
];
