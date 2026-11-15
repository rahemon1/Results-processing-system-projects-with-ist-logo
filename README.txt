RESULT PROCESSING SYSTEM - COMPLETE EDITABLE WEBSITE
====================================================

RUN ON WINDOWS

1. Extract this ZIP completely.
2. Open the Result-Processing-System folder.
3. Double-click START-WINDOWS.bat.

The launcher starts the web server and opens your browser automatically.
It does NOT run npm install or download packages. All runtime JavaScript,
CSS, icons, and the backend are already built and included.

Required runtime: Node.js 22.13 or newer. Node.js 24 LTS is recommended.
If your installed Node.js is older, install Node.js 24 LTS once, then use
START-WINDOWS.bat for later launches.

Local address: http://127.0.0.1:4175/
Keep the separate server window open while using the website.
Stop the server with Ctrl+C in its window.

INITIAL ADMINISTRATOR LOGIN

Username: admin
Password: Admin@123

At first login, set your own password. This is required before you can
access records. The sample administrator password is only for first setup.

EVERYTHING CAN BE MANAGED FROM THE ADMIN PANEL

- Add and edit students, parents' names, registration, roll, and contact data.
- Add and edit departments, courses, credit hours, and academic sessions.
- Add and edit examinations and maximum marks.
- Enter assignment, class test, midterm, and final marks for the whole class.
- Paste blocks of marks from Excel or use CSV import/export.
- Save draft results, publish completed results, and unpublish for corrections.
- Calculate credit-weighted semester GPA and cumulative CGPA.
- Edit institution details and grading bands.
- Print individual semester results or consolidated academic transcripts.
- Reset student account passwords when necessary.

STUDENT ACCOUNTS

When an administrator registers a student, a student account is created.
The student's registration number is initially BOTH username and password.
The student selects Student on the login page, signs in, and sets a new
password. Students can view only their own published results. A student
account cannot edit administrative records or another student's results.

Example fictional student included in the sample database:
Username: 20231001
Initial password: 20231001

Test student access by signing out of the administrator account, then
choosing Student on the login screen. Separate browser profiles can keep
separate administrator and student sessions on the same computer.

WHERE RECORDS ARE SAVED

The first launch creates: data/results.sqlite
Records, account hashes, and sessions are stored in this SQLite database.
They are not stored only in the browser. Closing or refreshing the browser
does not erase your records. Stop the server before copying the data folder
as a backup. Keep this folder when upgrading the application.

The initial data is fictional demonstration data. The package does not
include your hosted website's database or any personal login credentials.

EDITING THE WEBSITE'S SOURCE CODE

The full editable source is included:

client/ui.tsx               Pages, forms, tables, dashboard, and navigation
client/globals.css          Colors, spacing, responsive design, and print styles
shared/academic.ts          Student/course types, validation, and GPA/CGPA rules
client/brand.ts             Institute logo
server.mjs                 Local HTTP server and static file serving
server/database.mjs        SQLite adapter and migration application
server/portal-server.ts    Authentication, permissions, accounts, and saving
shared/password.ts         Password hashing and verification
server/api-entry.ts        Backend bundle exports
server/api.mjs             Included built backend, in readable JavaScript
public/                    Included built frontend, with readable JS and CSS
index.html                 Frontend HTML source
scripts/build.mjs          Rebuilds frontend and backend from the source
checks/server-check.mjs    21 integration checks against a real local server
DATABASE-SCHEMA.sql        SQL database structure

To change records, names, marks, subjects, credits, institution details,
grading, or examination names, use the admin panel. No rebuild is needed.

To change the layout or application code, edit the files in client/ or
server/. Then double-click EDIT-FRONTEND-WINDOWS.bat to rebuild. This editing
helper installs development tools on its first use. It is separate from
the normal START-WINDOWS.bat launcher, which needs no npm installation.

Manual source rebuild:
  npm install
  npm run build

The shared/academic.ts file is used by both the frontend and backend. Restart the server after rebuilding backend
code and refresh the browser after rebuilding the frontend.

MANUAL RUN / VALIDATION

Start:        node server.mjs
Run checks:   node checks/server-check.mjs

You can run the already-built server without installing npm packages.
The server uses Node's built-in SQLite module, HTTP module, and Web Crypto.

IMPORTANT OPERATING NOTES

This package binds to your own computer at 127.0.0.1. It is a full local
client/server application with real accounts and a SQLite database. It is
not published to the internet or available to other devices automatically.
A shared institutional deployment needs hosting, HTTPS, access policies,
and its own database backup arrangements.

Grade bands apply to marks as a percentage of the total assessment maxima.
Failed courses retain their attempted credits and contribute zero points.
Blank marks are pending; zero is an actual recorded mark. Complete all
required marks before publishing. Published marks are locked until the
administrator unpublishes the affected semester. CGPA uses the latest
completed attempt per course code; student CGPA uses published semesters.

TROUBLESHOOTING

- Extract the ZIP before using the launcher. Do not run it from ZIP preview.
- Do not open index.html directly; use START-WINDOWS.bat.
- If the launcher reports an old Node.js version, install Node.js 24 LTS.
- If the browser does not open automatically, visit http://127.0.0.1:4175/.
- If port 4175 is busy, close the old server or set PORT to another number
  before running node server.mjs.
- Do not remove data/results.sqlite unless you want to start a new database.
- After five failed login attempts, that account/IP must wait 15 minutes.
