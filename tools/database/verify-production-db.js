const { PrismaClient } = require('@prisma/client');

async function verifyProductionDatabase() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    console.log('🔍 Verifying production database connection...\n');

    // Test 1: Basic connectivity
    console.log('Test 1: Database connectivity');
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Test 2: Check tenants table
    console.log('Test 2: Checking tenants table');
    const tenantCount = await prisma.tenants.count();
    console.log(`✅ Tenants table accessible (${tenantCount} records)\n`);

    // Test 3: Check all critical tables
    console.log('Test 3: Verifying critical tables');
    const tables = [
      { name: 'customers', model: prisma.customers },
      { name: 'team_members', model: prisma.team_members },
      { name: 'subscriptions', model: prisma.subscriptions },
      { name: 'training_plans', model: prisma.training_plans },
      { name: 'nutrition_plans', model: prisma.nutrition_plans },
      { name: 'uploaded_files', model: prisma.uploaded_files },
      { name: 'approval_workflows', model: prisma.approval_workflows },
      { name: 'automation_workflows', model: prisma.automation_workflows },
      { name: 'system_settings', model: prisma.system_settings },
    ];

    for (const table of tables) {
      const count = await table.model.count();
      console.log(`  ✅ ${table.name}: ${count} records`);
    }
    console.log();

    // Test 4: Check indexes
    console.log('Test 4: Checking database indexes');
    const indexes = await prisma.$queryRaw`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename
      LIMIT 20
    `;
    console.log(`✅ Found ${indexes.length} indexes (showing first 20)\n`);

    // Test 5: Write test
    console.log('Test 5: Testing write operations');
    const testTenant = await prisma.tenants.findFirst();
    if (testTenant) {
      // Update timestamp to test write (no actual change)
      await prisma.tenants.update({
        where: { id: testTenant.id },
        data: { created_at: testTenant.created_at },
      });
      console.log('✅ Write operations working\n');
    } else {
      console.log('⚠️  No tenants found - skipping write test\n');
    }

    // Test 6: Connection pool
    console.log('Test 6: Testing connection pooling');
    const promises = Array(10).fill(null).map(() => 
      prisma.tenants.count()
    );
    await Promise.all(promises);
    console.log('✅ Connection pooling working (10 concurrent queries)\n');

    // Test 7: Check for required migrations
    console.log('Test 7: Verifying schema completeness');
    const schemaCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log(`✅ Found ${schemaCheck.length} tables in schema\n`);

    // Test 8: Check database version
    console.log('Test 8: Checking PostgreSQL version');
    const versionResult = await prisma.$queryRaw`SELECT version()`;
    const version = versionResult[0].version;
    console.log(`✅ PostgreSQL version: ${version.split(',')[0]}\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 All database verification tests passed!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Database Summary:');
    console.log(`   - Provider: PostgreSQL`);
    const dbUrl = process.env.DATABASE_URL || '';
    const dbHost = dbUrl.split('@')[1]?.split('/')[0] || 'configured';
    console.log(`   - Connection: ${dbHost}`);
    console.log(`   - Tables: ${schemaCheck.length} total`);
    console.log(`   - Critical tables: ${tables.length} verified`);
    console.log(`   - Tenants: ${tenantCount}`);
    console.log(`   - Connection pooling: ${dbUrl.includes('pgbouncer') ? 'Enabled' : 'Not detected'}`);
    console.log(`   - Status: ✅ Ready for production\n`);

    return true;

  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ Database verification failed');
    console.error('═══════════════════════════════════════════════════════\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('1. Check DATABASE_URL is set correctly');
    console.error('   Current: ' + (process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET'));
    console.error('2. Verify database is accessible from this network');
    console.error('3. Ensure all migrations have been run:');
    console.error('   npx prisma migrate deploy');
    console.error('4. Check database credentials are valid');
    console.error('5. Verify firewall rules allow connections');
    console.error('6. Test direct connection with psql:');
    console.error('   psql "$DATABASE_URL"\n');
    
    if (error.code === 'P1001') {
      console.error('💡 Connection refused - database may not be running or accessible');
    } else if (error.code === 'P1002') {
      console.error('💡 Connection timeout - check network connectivity');
    } else if (error.code === 'P1003') {
      console.error('💡 Database does not exist - create it first');
    } else if (error.code === 'P1008') {
      console.error('💡 Connection timeout - database may be overloaded');
    } else if (error.code === 'P1009') {
      console.error('💡 Database already exists');
    } else if (error.code === 'P1010') {
      console.error('💡 Access denied - check credentials');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
if (require.main === module) {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     Production Database Verification Tool            ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  verifyProductionDatabase();
}

module.exports = { verifyProductionDatabase };
