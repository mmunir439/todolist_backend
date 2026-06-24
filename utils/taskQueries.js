const dayjs = require("dayjs");

exports.getDateRange = (due) => {
  const now = dayjs();
  const startOfDay = now.startOf("day").toDate();
  const endOfDay = now.endOf("day").toDate();

  if (due === "today") {
    return {
      status: { $ne: "done" },
      dueDate: { $lte: endOfDay, $ne: null },
    };
  }

  if (due === "overdue") {
    return {
      status: { $ne: "done" },
      dueDate: { $lt: startOfDay, $ne: null },
    };
  }

  if (due === "upcoming") {
    const endOfWeek = now.add(7, "day").endOf("day").toDate();
    return {
      status: { $ne: "done" },
      dueDate: { $gte: startOfDay, $lte: endOfWeek, $ne: null },
    };
  }

  return {};
};
