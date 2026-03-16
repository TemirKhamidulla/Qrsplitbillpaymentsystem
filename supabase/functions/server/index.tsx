import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b219b36a/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-b219b36a/admin/dashboard", async (c) => {
  try {
    let dashboardData = await kv.get("admin:dashboard");
    if (!dashboardData) {
      dashboardData = {
        metrics: {
          revenue: 1150000,
          revenueTrend: "+14.5%",
          activeTables: 24,
          tablesTrend: "+2",
          totalOrders: 156,
          ordersTrend: "+12.5%",
          averageBill: 18450,
          billTrend: "+4.2%"
        },
        revenueChart: [
          { id: '1', time: '10:00', amount: 45000 },
          { id: '2', time: '12:00', amount: 120000 },
          { id: '3', time: '14:00', amount: 350000 },
          { id: '4', time: '16:00', amount: 280000 },
          { id: '5', time: '18:00', amount: 420000 },
          { id: '6', time: '20:00', amount: 850000 },
          { id: '7', time: '22:00', amount: 1150000 },
        ],
        recentActivity: [
          { id: 1, title: "Table 12 Paid", desc: "QR Payment • ₸ 45,000", time: "2m ago" },
          { id: 2, title: "New Order • Table 4", desc: "Waiter: Danais", time: "15m ago" },
          { id: 3, title: "Menu Updated", desc: "Tom Yum price changed", time: "1h ago" },
          { id: 4, title: "Table 8 Paid", desc: "Card • ₸ 12,500", time: "1h ago" },
          { id: 5, title: "Table 2 Paid", desc: "Cash • ₸ 34,000", time: "2h ago" },
        ]
      };
      await kv.set("admin:dashboard", dashboardData);
    }
    return c.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    return c.json({ error: "Failed to fetch dashboard data" }, 500);
  }
});

app.get("/make-server-b219b36a/admin/staff", async (c) => {
  try {
    let staffData = await kv.get("admin:staff");
    if (!staffData) {
      staffData = [
        { id: '1', name: 'Temirlan', role: 'Admin', status: 'Active', shifts: 5, sales: 0 },
        { id: '2', name: 'Kamila', role: 'Waiter', status: 'Active', shifts: 12, sales: 450000 },
        { id: '3', name: 'Danais', role: 'Waiter', status: 'Active', shifts: 10, sales: 380000 },
        { id: '4', name: 'Inkar', role: 'Waiter', status: 'Active', shifts: 14, sales: 520000 },
      ];
      await kv.set("admin:staff", staffData);
    }
    return c.json(staffData);
  } catch (error) {
    console.error("Staff error:", error);
    return c.json({ error: "Failed to fetch staff data" }, 500);
  }
});

app.post("/make-server-b219b36a/admin/staff", async (c) => {
  try {
    const newStaff = await c.req.json();
    let staffData = await kv.get("admin:staff") || [];
    staffData.push(newStaff);
    await kv.set("admin:staff", staffData);
    return c.json({ success: true, staff: newStaff });
  } catch (error) {
    return c.json({ error: "Failed to add staff" }, 500);
  }
});

app.delete("/make-server-b219b36a/admin/staff/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let staffData = await kv.get("admin:staff") || [];
    staffData = staffData.filter((s: any) => s.id !== id);
    await kv.set("admin:staff", staffData);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to delete staff" }, 500);
  }
});

app.post("/make-server-b219b36a/payments", async (c) => {
  try {
    const paymentData = await c.req.json();
    const paymentId = Date.now().toString();
    
    // Save payment to kv store
    let payments = await kv.get("payments:all") || [];
    payments.push({ id: paymentId, ...paymentData, timestamp: new Date().toISOString() });
    await kv.set("payments:all", payments);
    
    // Update dashboard metrics if needed
    let dashboardData = await kv.get("admin:dashboard");
    if (dashboardData) {
      dashboardData.metrics.revenue += paymentData.total || 0;
      dashboardData.metrics.totalOrders += 1;
      
      const newActivity = { 
        id: Date.now(), 
        title: `Table ${paymentData.tableNumber || '?'} Paid`, 
        desc: `Total • ₸ ${paymentData.total || 0}`, 
        time: "Just now" 
      };
      dashboardData.recentActivity = [newActivity, ...dashboardData.recentActivity].slice(0, 5);
      await kv.set("admin:dashboard", dashboardData);
    }

    // Update staff sales if waiter is set
    if (paymentData.waiter) {
      let staffData = await kv.get("admin:staff");
      if (staffData && Array.isArray(staffData)) {
        const staffIndex = staffData.findIndex(s => s.name.toLowerCase() === paymentData.waiter.toLowerCase());
        if (staffIndex >= 0) {
          staffData[staffIndex].sales = (staffData[staffIndex].sales || 0) + (paymentData.total || 0);
          await kv.set("admin:staff", staffData);
        }
      }
    }
    
    return c.json({ success: true, paymentId });
  } catch (error) {
    console.error("Payment error:", error);
    return c.json({ error: "Failed to save payment" }, 500);
  }
});

Deno.serve(app.fetch);