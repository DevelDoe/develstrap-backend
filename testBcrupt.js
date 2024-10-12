const bcrypt = require('bcrypt');

const password = 'password123';
const storedHash = '$2b$10$D943D7lcXRB.FYrnjT8lk.3nj2.wMMWKmyXwpfJxd5jznOjawLTmm'; // Example from your output

// Test password comparison
bcrypt.compare(password, storedHash, (err, isMatch) => {
    if (err) throw err;
    console.log('Password match result:', isMatch); // Should print true if they match
});