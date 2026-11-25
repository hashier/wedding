/**
 * @OnlyCurrentDoc
 */
// The annotation above limits the permission to this one spreadsheet instead of
// all your Sheets: https://developers.google.com/apps-script/guides/services/authorization
//
// RSVP receiver for the wedding page: appends each answer as a row to a Google Sheet.
// It stores whatever fields the form sends and adds a column for any new field,
// so changing the form on the page needs no change here.
//
// Setup (about 5 minutes):
// 1. Create a new Google Sheet, e.g. "Wedding RSVPs".
// 2. In the Sheet: Extensions > Apps Script. Replace the code there with this file.
// 3. Optional, to get a mail for each RSVP: Project Settings (gear icon) > Script Properties >
//    Add script property. Property: NOTIFY_EMAILS, value: one or more addresses,
//    separated by commas. Kept there, the addresses stay out of this file and the repo.
// 4. Deploy > New deployment > type "Web app".
//    Execute as: Me. Who has access: Anyone. Click Deploy and allow the permissions.
// 5. Copy the "Web app URL" (ends in /exec) into rsvpUrl in index.html.
// After changing this code later, use Deploy > Manage deployments > Edit > New version,
// so the URL stays the same.

// Comma-separated addresses from the script property NOTIFY_EMAILS (see setup step 3).
const notifyEmails = () =>
  (PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAILS") || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

// Bots can post any field names; only short lowercase names become columns,
// and the sheet never grows past MAX_COLUMNS.
const FIELD_NAME = /^[a-z]{1,20}$/;
const MAX_COLUMNS = 30;
const IGNORED = ["website"]; // the honeypot

// A value starting with = + - or @ would run as a formula in Sheets; the leading
// apostrophe makes Sheets store it as plain text.
const asText = (value) => {
  const s = String(value || "").slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
};

function doPost(e) {
  const p = e.parameter;
  // Honeypot: the "website" field is hidden from people, so only bots fill it.
  if (p.website) return ContentService.createTextOutput("ok");

  const fields = Object.keys(p).filter((k) => FIELD_NAME.test(k) && !IGNORED.includes(k));

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const existing = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(String)
      : [];
    const known = existing.length ? existing : ["received"];
    const header = known
      .concat(fields.filter((f) => !known.includes(f)))
      .slice(0, MAX_COLUMNS);
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    sheet.appendRow(header.map((h) => (h === "received" ? new Date() : asText(p[h]))));
  } finally {
    lock.releaseLock();
  }

  // MailApp takes several recipients as one comma-separated string.
  const recipients = notifyEmails().join(",");
  if (recipients) {
    MailApp.sendEmail(
      recipients,
      "RSVP: " + p.name + " (" + p.attending + ")",
      fields.map((f) => f + ": " + (p[f] || "")).join("\n")
    );
  }
  return ContentService.createTextOutput("ok");
}
