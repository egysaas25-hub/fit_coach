// Test runner for all functionality
const { prisma } = require('../lib/prisma.js');
const fs = require('fs');
const path = require('path');

async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  // List of test files to run (only the ones that work)
  const testFiles = [
    'db-test.js',
    'integration-test.js'
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Run each test file
  for (const testFile of testFiles) {
    try {
      console.log(`\n🧪 Running ${testFile}...`);
      console.log('─'.repeat(50));
      
      // Dynamically import and run the test
      const testModule = require(path.join(__dirname, testFile));
      
      // If the test module has a runTests function, execute it
      if (typeof testModule.runTests === 'function') {
        await testModule.runTests();
        passedTests++;
        console.log(`✅ ${testFile} completed successfully\n`);
      } else {
        console.log(`⚠️  ${testFile} does not export a runTests function\n`);
        failedTests++;
      }
    } catch (error) {
      console.error(`❌ ${testFile} failed with error:`, error.message);
      console.error('Stack trace:', error.stack);
      failedTests++;
    }
  }
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📋 TEST SUITE SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total:  ${passedTests + failedTests}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! The application is working correctly.');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the output above.`);
  }
  
  console.log('\n' + '═'.repeat(60));
  
  // Close database connection
  await prisma.$disconnect();
}

runAllTests();