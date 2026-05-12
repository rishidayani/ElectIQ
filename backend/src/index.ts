import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { getAllElections, getElectionResults, getAggregatedResults } from './controllers/election';
import { getParties, getCandidates } from './controllers/partyCandidate';
import { getConstituencies, getConstituencyDetails } from './controllers/constituency';
import multer from 'multer';
import { ingestCSV } from './services/ingestion';
import prisma from './prisma';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/elections', getAllElections);
app.get('/api/elections/:id/results', getElectionResults);
app.get('/api/elections/:id/aggregate', getAggregatedResults);
app.get('/api/constituencies', getConstituencies);
app.get('/api/constituencies/:id', getConstituencyDetails);
app.get('/api/parties', getParties);
app.get('/api/candidates', getCandidates);

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alertHistory.findMany({
      include: { rule: true },
      orderBy: { triggeredAt: 'desc' }
    });
    res.json({ data: alerts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const { electionId, mapping } = req.body;
  const file = req.file;

  if (!file || !electionId || !mapping) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const parsedMapping = JSON.parse(mapping);
    const result = await ingestCSV(electionId, file.buffer, parsedMapping, 'admin');
    
    // Notify clients of update
    io.emit('data_updated', { electionId });

    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io, prisma };
