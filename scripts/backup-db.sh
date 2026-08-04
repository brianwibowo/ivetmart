#!/bin/bash
# ─── Ivet Mart — Database Backup Script ───
# Jalankan: bash scripts/backup-db.sh
# Atau jadwalkan via cron: 0 2 * * * /path/to/scripts/backup-db.sh
#
# Menyimpan backup ke ./backups/ dengan rotasi 30 hari.

set -euo pipefail

CONTAINER_NAME="${DB_CONTAINER:-ivetmart-db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-ivetmart}"
BACKUP_DIR="$(cd "$(dirname "$0")/.." && pwd)/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ivetmart_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📦 Memulai backup database '${DB_NAME}'..."
echo "   Container : ${CONTAINER_NAME}"
echo "   Output    : ${BACKUP_FILE}"

# Run pg_dump inside the container and compress
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$BACKUP_FILE"; then
  FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Backup berhasil! (${FILESIZE})"
else
  echo "❌ Backup gagal!"
  rm -f "$BACKUP_FILE"
  exit 1
fi

# Rotate old backups
DELETED=$(find "$BACKUP_DIR" -name "ivetmart_*.sql.gz" -mtime +"$RETENTION_DAYS" -print -delete | wc -l | tr -d ' ')
if [ "$DELETED" -gt 0 ]; then
  echo "🗑️  Menghapus ${DELETED} backup lama (>${RETENTION_DAYS} hari)"
fi

echo "📋 Daftar backup saat ini:"
ls -lh "$BACKUP_DIR"/ivetmart_*.sql.gz 2>/dev/null || echo "   (kosong)"
