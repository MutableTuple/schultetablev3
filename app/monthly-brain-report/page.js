import React from "react";
import Report from "../_components/PDFReport/Report";
import { getCurrentUser } from "../_utils/getCurrentUser";
import Navbar from "../_components/Navbar";

export default async function page() {
  const user = await getCurrentUser();
  console.log("USER REPORT", user);
  return (
    <div>
      <Navbar />
      <Report user={user} />
    </div>
  );
}
