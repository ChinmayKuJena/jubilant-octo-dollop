# Security Policy

## Supported Technologies

This project uses the following technologies for its operations and security:

- **Groq**: Used for querying the database and handling advanced query needs.
- **JWT Authentication**: JSON Web Tokens are implemented for secure API authentication, ensuring that only authorized users can access protected endpoints.
- **OTP Authentication**: To enhance security during user login and sensitive actions, OTP (One-Time Password) is required for additional verification.
- **Redis Cloud**: Used to manage session data and caching mechanisms, ensuring fast data retrieval and high performance.
- **Socket.io**: Real-time communication is enabled using Socket.io for WebSocket-based connections. You can connect to the service using:
  - `http://localhost:2222` (for non-SSL)
  - `https://localhost:2222` (for SSL)

## Security Vulnerabilities

If you discover any security vulnerabilities in this project, please follow these steps:

1. **Do not open an issue** directly. This will help prevent malicious actors from taking advantage of vulnerabilities.
2. Instead, send a detailed report via [email or secure messaging]. Please include the following information:
   - A description of the vulnerability and steps to reproduce.
   - The impact and any possible solutions or patches you have identified.
3. We will review your report, and if confirmed, we will work to fix the issue and provide an appropriate response.

## Reporting a Security Vulnerability

To report a security issue, please email us at: [chinmay.jena7878@gmail.com].

Your email should contain the following:
- A brief description of the issue.
- Steps to reproduce (if applicable).
- Your contact information (optional, but helpful).

## Security Best Practices

We encourage all contributors and users of this project to follow best practices for security:
- Regularly update dependencies and libraries.
- Use HTTPS for secure communication.
- Use strong passwords for authentication.
- Ensure JWT tokens are stored securely and are not exposed to unauthorized parties.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

