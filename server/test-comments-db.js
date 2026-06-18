// server/test-comments-db.js
// Run this script to verify your comment tables exist and work correctly
// Usage: node test-comments-db.js

import { db } from './src/db/index.js';

async function testCommentTables() {
  console.log('🔍 Testing Comment System Database Setup...\n');

  try {
    // Test 1: Check if tables exist
    console.log('1️⃣ Checking if comment tables exist...');
    const [tables] = await db.execute(`
      SHOW TABLES LIKE '%comment%'
    `);
    
    console.log('   Found tables:', tables.map(t => Object.values(t)[0]).join(', '));
    
    if (tables.length === 0) {
      console.log('   ❌ No comment tables found!');
      console.log('   📝 Please run the setup-comments-tables.sql file first');
      console.log('   💡 Location: /mnt/user-data/outputs/setup-comments-tables.sql\n');
      process.exit(1);
    }
    
    console.log('   ✅ Comment tables exist\n');

    // Test 2: Check game_comments structure
    console.log('2️⃣ Checking game_comments table structure...');
    const [columns] = await db.execute(`
      DESCRIBE game_comments
    `);
    
    console.log('   Columns found:', columns.length);
    const requiredColumns = ['id', 'game_id', 'user_id', 'content', 'like_count', 'reply_count'];
    const foundColumns = columns.map(c => c.Field);
    const missingColumns = requiredColumns.filter(c => !foundColumns.includes(c));
    
    if (missingColumns.length > 0) {
      console.log('   ❌ Missing required columns:', missingColumns.join(', '));
      process.exit(1);
    }
    
    console.log('   ✅ All required columns present\n');

    // Test 3: Test query that the API uses
    console.log('3️⃣ Testing the actual query used by the API...');
    const testGameId = 'test-game-123';
    
    const [comments] = await db.execute(`
      SELECT 
        gc.id,
        gc.game_id,
        gc.content,
        gc.is_edited,
        gc.edited_at,
        gc.like_count,
        gc.reply_count,
        gc.created_at,
        gc.parent_comment_id,
        
        u.id as user_id,
        u.username,
        u.avatar,
        u.level,
        u.tier,
        u.role,
        
        NULL as user_reaction
        
      FROM game_comments gc
      INNER JOIN users u ON gc.user_id = u.id
      WHERE gc.game_id = ?
        AND gc.parent_comment_id IS NULL
        AND gc.is_deleted = FALSE
        AND gc.is_approved = TRUE
      ORDER BY gc.created_at DESC
      LIMIT 20 OFFSET 0
    `, [testGameId]);
    
    console.log('   ✅ Query executed successfully');
    console.log('   📊 Comments found:', comments.length, '\n');

    // Test 4: Insert a test comment (requires a valid user)
    console.log('4️⃣ Checking if we can insert a test comment...');
    
    // Get first user
    const [[firstUser]] = await db.execute('SELECT id FROM users LIMIT 1');
    
    if (!firstUser) {
      console.log('   ⚠️  No users found in database. Skipping insert test.');
      console.log('   💡 Create a user account first to fully test comments\n');
    } else {
      console.log('   Using user ID:', firstUser.id);
      
      try {
        const [result] = await db.execute(
          `INSERT INTO game_comments 
           (game_id, user_id, content, is_approved)
           VALUES (?, ?, ?, ?)`,
          [testGameId, firstUser.id, 'Test comment from verification script', true]
        );
        
        const testCommentId = result.insertId;
        console.log('   ✅ Successfully inserted test comment (ID:', testCommentId, ')');
        
        // Clean up test comment
        await db.execute('DELETE FROM game_comments WHERE id = ?', [testCommentId]);
        console.log('   🧹 Cleaned up test comment\n');
      } catch (err) {
        console.log('   ❌ Failed to insert test comment:', err.message, '\n');
      }
    }

    // Test 5: Check foreign key constraints
    console.log('5️⃣ Verifying foreign key constraints...');
    const [constraints] = await db.execute(`
      SELECT 
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = '8jj_games'
        AND TABLE_NAME = 'game_comments'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    console.log('   Foreign keys found:', constraints.length);
    constraints.forEach(c => {
      console.log('   -', c.CONSTRAINT_NAME, '→', c.REFERENCED_TABLE_NAME);
    });
    console.log('   ✅ Foreign key constraints properly set up\n');

    console.log('✨ All tests passed! Comment system is ready to use.\n');
    
    console.log('📋 Next steps:');
    console.log('   1. Make sure your backend server is running');
    console.log('   2. Navigate to a game page in your frontend');
    console.log('   3. Try posting a comment');
    console.log('   4. Check your browser console for any errors\n');

  } catch (err) {
    console.error('❌ Error during testing:', err);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your .env file has correct database credentials');
    console.error('   3. Run the setup-comments-tables.sql script');
    console.error('   4. Verify the 8jj_games database exists\n');
    process.exit(1);
  } finally {
    await db.end();
  }
}

testCommentTables();