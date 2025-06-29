import React from "react";
import { getSession } from "./auth";

export async function getMonthlyStats() {
  const session = await getSession();
}
getMonthlyStats();
