export function publicJobFilter(extra = {}) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return {
    $and: [
      { status: "active" },
      {
        $or: [
          { lastDate: { $exists: false } },
          { lastDate: null },
          { lastDate: { $gte: today } },
        ],
      },
      {
        $or: [
          { roleDescription: { $exists: true, $nin: ["", null] } },
          { responsibilities: { $exists: true, $nin: ["", null] } },
          { requirements: { $exists: true, $nin: ["", null] } },
        ],
      },
      extra,
    ],
  };
}