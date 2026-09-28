import express from "express";
import User from "../models/User.js";
import UserActivity from "../models/UserActivity.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const DAY_MS = 24 * 60 * 60 * 1000;
const ADMIN_TIME_ZONE = "Asia/Kolkata";

function localDateKey(date){
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ADMIN_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function blankDay(date){
  return { date, users: new Set(), newUsers: 0, returnUsers: new Set(), appliedUsers: new Set(), applications: 0 };
}

router.get("/analytics/today", requireAdmin, async (req, res) => {
  try {
    const range = ["24h", "7d", "30d"].includes(req.query.range) ? req.query.range : "24h";
    const end = new Date();
    const start = new Date(end.getTime() - (range === "24h" ? DAY_MS : Number(range.slice(0, -1)) * DAY_MS));
    const [newUsers, activities] = await Promise.all([
      User.find({ createdAt: { $gte: start, $lt: end } })
        .select("name email phone createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      UserActivity.find({ createdAt: { $gte: start, $lt: end } })
        .populate("user", "name email phone createdAt")
        .populate("job", "title organization")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const rows = new Map();
    const days = new Map();
    const totalUsers = new Set();
    const returnUsers = new Set();
    const appliedUsers = new Set();
    let applications = 0;

    const dayAt = date => {
      const key = localDateKey(date);
      if (!days.has(key)) days.set(key, blankDay(key));
      return days.get(key);
    };
    const rowAt = (user, date) => {
      if (!user) return null;
      const dateKey = localDateKey(date);
      const key = `${user._id}-${dateKey}`;
      if (!rows.has(key)) rows.set(key, {
        date: dateKey,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        newUser: false,
        returnUser: false,
        appliedJobs: new Set(),
        applicationCount: 0,
        lastActivityAt: date,
      });
      const row = rows.get(key);
      if (new Date(date) > new Date(row.lastActivityAt)) row.lastActivityAt = date;
      return row;
    };

    for (const user of newUsers) {
      const userId = user._id.toString();
      const createdAt = user.createdAt;
      totalUsers.add(userId);
      const signupDay = dayAt(createdAt);
      signupDay.newUsers += 1;
      signupDay.users.add(userId);
      rowAt(user, createdAt).newUser = true;
    }

    for (const activity of activities) {
      const user = activity.user;
      if (!user) continue;
      const userId = user._id.toString();
      const eventDay = dayAt(activity.createdAt);
      const row = rowAt(user, activity.createdAt);
      totalUsers.add(userId);
      eventDay.users.add(userId);

      if (activity.type === "visit" && activity.isReturn) {
        returnUsers.add(userId);
        eventDay.returnUsers.add(userId);
        row.returnUser = true;
      }
      if (activity.type === "apply") {
        applications += 1;
        appliedUsers.add(userId);
        eventDay.applications += 1;
        eventDay.appliedUsers.add(userId);
        if (row) {
          row.applicationCount += 1;
          if (activity.job) row.appliedJobs.add(`${activity.job.title || "Job"} — ${activity.job.organization || "Company"}`);
        }
      }
    }

    const daily = [...days.values()].sort((a, b) => b.date.localeCompare(a.date)).map(day => ({
      date: day.date,
      users: day.users.size,
      newUsers: day.newUsers,
      returnUsers: day.returnUsers.size,
      appliedUsers: day.appliedUsers.size,
      applications: day.applications,
    }));
    const userRows = [...rows.values()].map(row => ({
      ...row,
      appliedJobs: [...row.appliedJobs],
      applicationCount: row.applicationCount,
    })).sort((a, b) => b.lastActivityAt - a.lastActivityAt);

    res.set("Cache-Control", "no-store");
    res.json({
      range,
      timeZone: ADMIN_TIME_ZONE,
      from: start,
      to: end,
      generatedAt: end,
      summary: {
        users: totalUsers.size,
        newUsers: newUsers.length,
        returnUsers: returnUsers.size,
        appliedUsers: appliedUsers.size,
        applications,
      },
      daily,
      rows: userRows,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not load user activity", error: err.message });
  }
});

export default router;
