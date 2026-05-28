import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  // IMPORTANT

  await page.goto("http://localhost:3000/monthly-brain-report", {
    waitUntil: "networkidle0",
  });

  // PDF SETTINGS

  const pdf = await page.pdf({
    format: "A4",

    printBackground: true,

    margin: {
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  });

  await browser.close();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",

      "Content-Disposition": 'attachment; filename="schultetable-report.pdf"',
    },
  });
}
