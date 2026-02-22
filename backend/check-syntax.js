try {
  require('./index.js');
  console.log('Server syntax is valid');
} catch (error) {
  console.error('Server syntax error:', error.message);
}
