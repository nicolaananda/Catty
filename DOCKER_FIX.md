# Quick Fix Guide for Docker Deployment

If you encounter the `SQLITE_CANTOPEN` error, follow these steps:

## On Your VPS

1. **Stop and remove existing containers:**
   ```bash
   docker-compose down -v
   ```

2. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

3. **Rebuild and start:**
   ```bash
   docker-compose up -d --build
   ```

4. **Check logs:**
   ```bash
   docker logs receivemail-backend
   docker logs receivemail-frontend
   ```

## What Was Fixed

- Changed from bind mount to Docker named volume for database
- Database now stored in `/app/data/database.sqlite` inside container
- Volume `db-data` persists data across container restarts
- Automatic directory creation in `db.js`

## Verify Database

```bash
# Check if database was created
docker exec receivemail-backend ls -la /app/data/

# View database content
docker exec receivemail-backend sqlite3 /app/data/database.sqlite ".tables"
```
