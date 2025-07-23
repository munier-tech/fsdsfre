# MERN to PERN Migration Guide

This guide explains how to migrate your school management system from MongoDB (MERN) to PostgreSQL (PERN) while maintaining minimal changes to your existing backend logic.

## 🎯 Overview

**What Changed:**
- Database: MongoDB → PostgreSQL
- ORM: Mongoose → Sequelize
- Data modeling: Document-based → Relational tables
- IDs: ObjectId (`_id`) → Serial integers (`id`)

**What Stayed the Same:**
- REST API endpoints (same URLs)
- Request/Response formats
- Authentication flow
- Business logic
- Frontend remains unchanged

## 📋 Prerequisites

1. **PostgreSQL** (version 12+)
2. **Node.js** (version 16+)
3. **npm** or **yarn**

## 🚀 Setup Instructions

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE school_management;
CREATE USER school_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_user;
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

**New dependencies added:**
- `sequelize` - PostgreSQL ORM
- `pg` - PostgreSQL client
- `pg-hstore` - Serialization support
- `sequelize-cli` - CLI tools

**Removed dependencies:**
- `mongoose` - MongoDB ORM

### 4. Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=school_management
POSTGRES_USER=school_user
POSTGRES_PASSWORD=your_password

# Keep existing MongoDB config for migration
MONGO_URI=mongodb://localhost:27017/your_mongo_db

# Other existing configurations...
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 5. Database Setup

**Option A: Automatic Setup (Recommended)**
```bash
npm run dev
```
The app will automatically create tables on first run.

**Option B: Manual SQL Setup**
```bash
psql -U school_user -d school_management -f backend/sql/schema.sql
```

### 6. Data Migration (Optional)

If you have existing MongoDB data:

```bash
# Ensure MongoDB is running and accessible
npm run migrate
```

This will:
- Connect to both MongoDB and PostgreSQL
- Copy all existing data
- Maintain relationships
- Map ObjectIds to serial integers

## 🗂️ Schema Mapping

### MongoDB → PostgreSQL

| MongoDB Collection | PostgreSQL Table | Key Changes |
|-------------------|------------------|-------------|
| `users` | `Users` | `_id` → `id` (SERIAL) |
| `students` | `Students` | `class` (ObjectId) → `classId` (INTEGER) |
| `classes` | `Classes` | `students[]` → Relationship via `Students.classId` |
| `teachers` | `Teachers` | Same structure, `_id` → `id` |
| `healths` | `Healths` | `student` (ObjectId) → `studentId` (INTEGER) |
| `attendances` | `Attendances` + `AttendanceRecords` | Split into two tables |

### Relationship Changes

**Before (MongoDB):**
```javascript
// Nested array in attendance
{
  class: ObjectId("..."),
  students: [
    { student: ObjectId("..."), status: "present" }
  ]
}
```

**After (PostgreSQL):**
```javascript
// Separate tables with foreign keys
Attendance: { id: 1, classId: 1, date: "2024-01-15" }
AttendanceRecord: { id: 1, attendanceId: 1, studentId: 1, status: "present" }
```

## 🔄 API Changes

### Query Syntax

**Mongoose → Sequelize:**

```javascript
// Before (Mongoose)
await Student.find({ age: { $gte: 18 } })
  .populate('class')
  .sort({ createdAt: -1 });

// After (Sequelize)
await Student.findAll({
  where: { age: { [Op.gte]: 18 } },
  include: [{ model: Class, as: 'class' }],
  order: [['createdAt', 'DESC']]
});
```

### CRUD Operations

**Create:**
```javascript
// Before
const student = new Student(data);
await student.save();

// After
const student = await Student.create(data);
```

**Update:**
```javascript
// Before
await Student.findByIdAndUpdate(id, data, { new: true });

// After
const [count, [updated]] = await Student.update(data, {
  where: { id },
  returning: true
});
```

**Delete:**
```javascript
// Before
await Student.findByIdAndDelete(id);

// After
await Student.destroy({ where: { id } });
```

## 🛠️ Error Handling

### Error Mapping

| MongoDB Error | PostgreSQL Error | Handler |
|---------------|------------------|---------|
| `CastError` | `ValidationError` | 400 - Invalid input |
| `11000` (Duplicate) | `UniqueConstraintError` | 409 - Duplicate entry |
| `ValidationError` | `ValidationError` | 400 - Validation failed |
| Connection errors | `ConnectionError` | 503 - Service unavailable |

### Usage in Controllers

```javascript
import { handleSequelizeError } from '../helpers/errorHandler.js';

try {
  // Database operation
} catch (error) {
  const { statusCode, message } = handleSequelizeError(error);
  return res.status(statusCode).json({ message });
}
```

## 📊 Performance Optimizations

### Indexes Added

```sql
-- Frequently queried fields
CREATE INDEX idx_students_fullname ON "Students"("fullname");
CREATE INDEX idx_students_classId ON "Students"("classId");
CREATE INDEX idx_attendances_date ON "Attendances"("date");
```

### Query Optimizations

```javascript
// Eager loading with specific attributes
await Student.findAll({
  attributes: ['id', 'fullname', 'age'],
  include: [{
    model: Class,
    as: 'class',
    attributes: ['id', 'name']
  }]
});
```

## 🧪 Testing

### Test Database Connection

```bash
node -e "
const { connectDb } = require('./backend/lib/database.js');
connectDb().then(() => console.log('✅ Connected')).catch(console.error);
"
```

### Verify Migration

```bash
# Check table creation
psql -U school_user -d school_management -c "\dt"

# Check data migration
psql -U school_user -d school_management -c "SELECT COUNT(*) FROM \"Students\";"
```

## 🚨 Troubleshooting

### Common Issues

**1. Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and credentials are correct.

**2. Table Doesn't Exist**
```
Error: relation "Students" does not exist
```
**Solution:** Run database sync or execute schema.sql

**3. Migration Fails**
```
Error: Cannot read property '_id' of null
```
**Solution:** Ensure MongoDB data exists and is properly formatted.

### Database Commands

```bash
# Reset database
DROP DATABASE school_management;
CREATE DATABASE school_management;

# Check connection
pg_isready -h localhost -p 5432

# View logs
tail -f /var/log/postgresql/postgresql-*.log
```

## 📝 Scripts

### Available NPM Scripts

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate      # Migrate data from MongoDB
npm run seed         # Seed sample data
```

## 🔄 Rollback Plan

If you need to rollback to MongoDB:

1. Keep old MongoDB models (renamed with `.old` extension)
2. Change import statements back
3. Update `index.js` to use MongoDB connection
4. Restore from MongoDB backup

## 📈 Benefits of Migration

✅ **ACID Transactions** - Better data consistency  
✅ **Referential Integrity** - Enforced foreign keys  
✅ **Complex Queries** - Advanced SQL capabilities  
✅ **Mature Ecosystem** - Better tooling and monitoring  
✅ **Horizontal Scaling** - Better scaling options  
✅ **Backup/Recovery** - Enterprise-grade features  

## 🎉 Migration Complete!

Your school management system is now running on PostgreSQL with minimal backend changes. The frontend continues to work without any modifications.

**Next Steps:**
1. Test all API endpoints
2. Verify data integrity
3. Monitor performance
4. Set up automated backups
5. Configure production environment

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify environment configuration
3. Check PostgreSQL logs
4. Test database connection
5. Validate data migration

---

**Happy coding with your new PERN stack! 🎊**