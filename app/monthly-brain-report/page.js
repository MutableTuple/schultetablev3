import React from "react";
import Report from "../_components/PDFReport/Report";
import { getCurrentUser } from "../_utils/getCurrentUser";

export default async function page() {
  const user = await getCurrentUser();
  console.log("USER REPORT", user);
  return <Report />;
}
