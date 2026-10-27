# Family Tree + RSVP Setup (one-time, ~10 minutes)

The Family Tree on the website builds itself from RSVP submissions stored in a
Google Sheet. Until you connect the sheet, the site shows a **sample preview
tree** and RSVPs are not saved anywhere. Follow these steps once:

## 1. Create the Google Sheet

1. Sign in to Google as **dodgevision@gmail.com** (or whichever account you
   want to own the data) and go to sheets.google.com → Blank sheet.
2. Name it something like `Vegas 27 RSVPs`.
3. In **row 1**, add these headers in this exact order (one per column, A–R):

   ```
   Timestamp  First  Last  Maiden  Father  Mother  Spouse  Children  Siblings  Adults  Kids  Attending  Permission  Notes  Deceased  PhotoURL  Bio  Hide
   ```

## 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete whatever is in the editor and paste the entire contents of
   `google-apps-script.js` (in this repo).
3. Click the save icon.

## 3. Deploy it as a Web App

1. **Deploy → New deployment → ⚙️ Web app**
2. Execute as: **Me** · Who has access: **Anyone**
3. Click **Deploy** and authorize when prompted.
   (If you hit the "unverified app" warning: Advanced → Go to … (unsafe) → Allow.
   If authorization errors out entirely, the OAuth consent screen needs a
   one-time setup in Google Cloud Console — ask Claude, we've solved it before.)
4. Copy the **Web app URL** (ends in `/exec`).

## 4. Paste the URL into the website

1. Open `index.html` and find this line (near the bottom, in the scripts):

   ```js
   const GOOGLE_SHEET_URL = '';
   ```

2. Paste your URL between the quotes:

   ```js
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
   ```

3. Commit/push the change. Done — every RSVP now:
   - adds a row to your sheet (including private notes + headcounts), and
   - automatically grows the public Family Tree (only for people who checked
     the permission box, and only name + relationships, never contact info,
     notes, or counts).

## Managing the tree (admin = the Google Sheet)

| Task | How |
|---|---|
| Fix a name typo | Edit the cell — tree updates on next page load |
| Merge duplicate people | Make the spellings identical, or delete the extra row |
| Add someone who didn't RSVP | Add a row by hand, set `Permission` = Yes |
| Mark someone as passed away | Put `Yes` in `Deceased` (shows 🕊️ memorial style) |
| Add a profile photo | Paste an image URL into `PhotoURL` |
| Add a short biography | Write it in `Bio` |
| Hide a person from the tree | Put `Yes` in `Hide` |
| Review change history / undo | Sheet menu: File → Version history |

## How matching works

People are matched by full name (accents/case ignored). A married person's
maiden name is also matched — e.g. an RSVP listing mother **"Sara Lopez"**
connects to **Sara Ortiz** if her RSVP listed maiden name *Lopez*. The more
relatives each person lists on their RSVP, the richer the tree gets. Branches
are colored by connection to the **Ortiz** (pink) and **Lopez** (cyan) family
lines; spouses who married in inherit their partner's branch.
