import { connectDb } from '../lib/database.js';
import { syncDatabase } from '../models/index.js';

const testConnection = async () => {
  try {
    console.log('🧪 Testing PostgreSQL connection...');
    
    // Test connection
    await connectDb();
    console.log('✅ Database connection successful');
    
    // Test table creation
    await syncDatabase();
    console.log('✅ Database tables created/synced successfully');
    
    console.log('🎉 All tests passed! Your PERN setup is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📝 Please check:');
    console.error('   - PostgreSQL is running');
    console.error('   - Database credentials in .env are correct');
    console.error('   - Database exists');
    process.exit(1);
  }
};

testConnection();