/**
 * VEGAS '27 — RSVP + FAMILY TREE BACKEND (Google Apps Script)
 * ============================================================
 * This script turns a Google Sheet into the database for the website's
 * RSVP form and the auto-building Family Tree.
 *
 *  - doPost : called by the RSVP form; appends one row per submission.
 *  - doGet  : called by the Family Tree; returns ONLY public, permitted
 *             fields as JSON (never notes, counts, or hidden rows).
 *
 * SETUP — see FAMILY-TREE-SETUP.md in this repo for the step-by-step guide.
 * Sheet column headers (row 1), in this exact order:
 *
 * Timestamp | First | Last | Maiden | Father | Mother | Spouse | Children |
 * Siblings | Adults | Kids | Attending | Permission | Notes | Deceased |
 * PhotoURL | Bio | Hide
 *
 * ADMIN: you manage the tree by editing the sheet directly —
 *  - fix a typo: edit the name cell (the tree redraws on next page load)
 *  - merge duplicates: make both rows use the identical spelling, or
 *    delete the duplicate row
 *  - add someone who didn't RSVP: add a row by hand (set Permission = Yes)
 *  - memorial: put Yes in Deceased
 *  - photo: paste an image URL in PhotoURL
 *  - bio: write it in Bio
 *  - hide someone from the tree: put Yes in Hide
 *  - change history / restore: File → Version history in Google Sheets
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var d = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    d.first || '', d.last || '', d.maiden || '',
    d.father || '', d.mother || '', d.spouse || '',
    d.children || '', d.siblings || '',
    d.adults || '', d.kids || '',
    d.attending || '', d.permission || '', d.notes || '',
    '', '', '', ''   // Deceased, PhotoURL, Bio, Hide — admin-only columns
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var rows = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
  var people = [];
  for (var i = 1; i < rows.length; i++) {   // skip header row
    var r = rows[i];
    var permission = String(r[12]).trim().toLowerCase();
    var hide = String(r[17]).trim().toLowerCase();
    if (permission !== 'yes' && permission !== 'si' && permission !== 'sí') continue;
    if (hide === 'yes') continue;
    people.push({
      first: String(r[1]), last: String(r[2]), maiden: String(r[3]),
      father: String(r[4]), mother: String(r[5]), spouse: String(r[6]),
      children: String(r[7]), siblings: String(r[8]),
      attending: String(r[11]),
      deceased: String(r[14]),
      photo: String(r[15]),
      bio: String(r[16]),
      permission: 'Yes'
    });
    // NOTE: Adults/Kids counts (r[9], r[10]) and Notes (r[13]) are
    // intentionally NEVER returned — they stay private in the sheet.
  }
  return ContentService
    .createTextOutput(JSON.stringify({ people: people }))
    .setMimeType(ContentService.MimeType.JSON);
}
