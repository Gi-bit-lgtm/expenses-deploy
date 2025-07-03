services:
  - type: web
    name: expense-tracker
    env: node
    rootDir: .
    buildCommand: |
      npm install --prefix frontend
      npm install --prefix backend
    startCommand: node backend/server.js
