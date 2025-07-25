# ChatGPT Clone - Ollama + Gemma

A full-stack ChatGPT-style chat application built with Next.js, Node.js, PostgreSQL, and Ollama with sam860/amoral-gemma3-1b-v2 model.

## 🚀 Features

- **Chat Interface**: Clean, modern ChatGPT-style interface
- **Real-time Streaming**: Token-by-token response streaming from Ollama
- **Multiple Chats**: Create, manage, and switch between multiple chat sessions
- **Chat History**: Persistent storage of all conversations
- **Stop Generation**: Interrupt AI responses mid-generation
- **Responsive Design**: Works on desktop and mobile devices
- **Local AI**: Powered by Ollama running locally (no API keys needed)

## 🛠 Tech Stack

### Frontend

- **Next.js 13** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database

### AI Model

- **Ollama** - Local LLM runtime
- **sam860/amoral-gemma3-1b-v2** - Efficient language model

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **PostgreSQL** database running
3. **Ollama** installed and running
4. **Gemma 1b model** pulled in Ollama

### Installing Ollama

1. Visit [ollama.com](https://ollama.com/download) and download for your OS
2. Install Ollama
3. Pull the model:
   ```bash
   ollama pull sam860/amoral-gemma3-1b-v2
   ```
4. Verify it's working:
   ```bash
   ollama run sam860/amoral-gemma3-1b-v2
   ```

### Setting up PostgreSQL

Make sure PostgreSQL is running and create a database called `chatdb`:

```sql
CREATE DATABASE chatdb;
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd frontend
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Chatbot/backend

# Install dependencies
npm install

# Set up environment variables
# Make sure .env file has:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatdb?schema=public"
# PORT=5000

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd chatbotFrontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:3000`

### 4. Start Ollama (if not already running)

```bash
# Start Ollama service
ollama serve

# In another terminal, make sure sam860/amoral-gemma3-1b-v2 is available
ollama list
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```properties
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatdb?schema=public"
PORT=5000
```

#### Frontend

The frontend is configured to connect to the backend at `http://localhost:5000/api`

### Database Schema

The application uses two main tables:

- **chats**: Stores chat sessions
- **messages**: Stores individual messages linked to chats

## 🎯 Usage

1. **Start a New Chat**: Click the "New Chat" button in the sidebar
2. **Send Messages**: Type your message and press Enter or click Send
3. **Switch Chats**: Click on any chat in the sidebar to switch to it
4. **Stop Generation**: Click the Stop button to interrupt AI responses
5. **View History**: All chats are automatically saved and can be revisited

## 🔄 API Endpoints

### Chat Management

- `POST /api/chat` - Create a new chat
- `GET /api/chats` - Get all chats
- `GET /api/chat/:chatId` - Get chat history

### Messaging

- `POST /api/chat/:chatId/message` - Send message and get streaming response
- `POST /api/chat/:chatId/stop` - Stop streaming response

## 🎨 Customization

### Changing the AI Model

To use a different Ollama model, update the model name in `backend/src/controllers/chatControllers.js`:

```javascript
model: "sam860/amoral-gemma3-1b-v2", // Change this to your preferred model
```

### Styling

The frontend uses Tailwind CSS. You can customize the appearance by modifying the component files in `src/components/`.

## 🐛 Troubleshooting

### Common Issues

1. **Ollama not responding**

   - Make sure Ollama is running: `ollama serve`
   - Check if the model is available: `ollama list`

2. **Database connection error**

   - Verify PostgreSQL is running
   - Check the DATABASE_URL in your .env file
   - Run `npx prisma db push` to ensure schema is up to date

3. **Frontend not connecting to backend**

   - Ensure backend is running on port 5000
   - Check CORS settings in backend if needed

4. **Streaming not working**
   - Verify Ollama is accessible at `http://localhost:11434`
   - Check browser developer tools for network errors

## 📝 Development

### Project Structure

```
├── Chatbot/backend/          # Backend API server
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/          # API routes
│   │   └── db.js            # Database connection
│   └── prisma/              # Database schema
├── chatbotFrontend/          # Frontend Next.js app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Next.js pages
│   │   └── utils/           # Utilities and context
│   └── public/              # Static assets
```

### Adding New Features

1. **Backend**: Add new routes in `routes/` and controllers in `controllers/`
2. **Frontend**: Create new components in `components/` and update context in `utils/`
3. **Database**: Modify schema in `prisma/schema.prisma` and run `npx prisma db push`

## 📈 Performance Tips

1. **Database**: Add indexes for frequently queried fields
2. **Frontend**: Implement virtual scrolling for large chat histories
3. **Caching**: Add Redis for session management in production
4. **Model**: Use larger Ollama models (gemma:2b, llama2:7b) for better responses

## 🚢 Deployment

For production deployment:

1. **Database**: Use a managed PostgreSQL service
2. **Backend**: Deploy to services like Railway, Render, or DigitalOcean
3. **Frontend**: Deploy to Vercel, Netlify, or similar
4. **Ollama**: Run on a dedicated server with GPU acceleration

## 🙏 Acknowledgments

- OpenAI for the ChatGPT interface inspiration
- Google for the Gemma model
- Ollama team for the excellent local LLM runtime
- Prisma team for the amazing database toolkit

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
