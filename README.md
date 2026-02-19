# Javascript Micro-service Boilerplate

This is a high-performance micro-service boilerplate built with Javascript, featuring Express, MongoDB (Mongoose), Redis, Jest, Socket.io, and OpenAPI (Swagger). It's designed to provide a robust and scalable foundation for your backend applications.

## Key Features

- **High Performance**: Optimized with asynchronous logging and efficient I/O handling.
- **Improved Utilities**: Enhanced `restAPI` service with native Axios support and better error handling.
- **RESTful API**: Clean architecture with Express and Mongoose.
- **Real-time**: Integrated Socket.io for real-time communication.
- **Documentation**: Automatic OpenAPI (Swagger) documentation.
- **Testing**: Comprehensive testing setup with Jest and Supertest.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16+)
- [MongoDB](https://docs.mongodb.com/manual/installation)
- [Redis](https://redis.io/download)
- npm or pnpm

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/amin-abbasi/javascript-boilerplate.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment:
   - Copy `.env.example` to `.env` and fill in your details.

### Running the App

Start the development server:

```bash
npm start
```

Or use [nodemon] for development:

```bash
npm install -g nodemon
nodemon
```

### Testing

We use Jest for unit and functional testing. Write your tests in the `__tests__` folder and run:

```bash
npm test
```

### Docker Support

Run the entire stack using Docker:

```bash
docker-compose up --build -d
```

#### References

[Node.js]: https://nodejs.org/en/download/
[MongoDB]: https://docs.mongodb.com/manual/installation
[Redis]: https://redis.io/download
[nodemon]: https://www.npmjs.com/package/nodemon
[Axios]: https://axios-http.com/
