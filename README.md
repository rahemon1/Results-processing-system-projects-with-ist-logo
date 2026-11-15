# Result Processing System

A complete editable local web application with a React/TypeScript frontend, Node.js server, SQLite persistence, and separate administrator/student accounts.

## Run on GitHub Codespaces

1. Create a private repository and extract the ZIP. Upload the contents of the `Result-Processing-System` folder. The repository root should show `server.mjs`, `package.json`, and a `.devcontainer` folder containing `devcontainer.json`. [Create a GitHub repository](https://github.com/new)
2. In the repository, select **Code → Codespaces → Create codespace on main**.
3. When the Codespaces terminal opens, run `npm start`. The frontend and server are prebuilt, so you can start directly.
4. In the **Ports** tab, find **4175** and choose **Open in Browser**. Keep the port visibility **Private**. Sign in with the initial administrator credentials below and set a new password.

Return to the same codespace and run `npm start` to reopen the app. The database stays in that codespace at `data/results.sqlite` across stops and restarts. Back it up outside the codespace before deleting it and keep it out of Git. The link is available while the codespace and server are running.

GitHub Pages hosts static files. For a permanent shared URL with admin and student sign-in, deploy the repository to a Node.js web host with persistent SQLite storage and secure first-login credentials.

## Run locally on Windows

On Windows, extract the archive and double-click `START-WINDOWS.bat`. Node.js 22.13+ is required; Node.js 24 LTS is recommended. All runtime assets are prebuilt, so starting the website does not need `npm install`.

Initial administrator: **admin / Admin@123**. Set a personal password at first login.

Use the administrator panel to add and edit departments, students, courses, examinations, grading rules, and class assessment sheets. Students sign in using their registration number as the initial username/password and view only their own published results after setting a password. Marks, accounts, and sessions are stored in `data/results.sqlite`.

The frontend source is in `client/`; the server source is in `server/`, and shared academic rules are in `shared/`. The runnable backend bundle and readable frontend build are included. Edit source, then run `npm install` once and `npm run build` when rebuilding. The frontend and backend use the same academic rules in `shared/academic.ts`.

```sh
node server.mjs
node checks/server-check.mjs
```

The application binds to loopback only. See `START-HERE.txt` for account details, file locations, backups, printing, operating notes, and source editing instructions.
