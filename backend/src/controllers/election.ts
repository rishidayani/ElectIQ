import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllElections = async (req: Request, res: Response) => {
  try {
    const elections = await prisma.election.findMany();
    res.json({ data: elections });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getElectionResults = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const results = await prisma.result.findMany({
      where: { constituency: { electionId: id } },
      include: {
        candidate: {
          include: { party: true }
        },
        constituency: true
      }
    });
    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAggregatedResults = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const results = await prisma.result.findMany({
      where: { constituency: { electionId: id } },
      include: {
        candidate: {
          include: { party: true }
        }
      }
    });

    const partyStats: Record<string, { party: any, votes: number, seats: number }> = {};

    results.forEach(r => {
      const partyId = r.candidate.partyId;
      if (!partyStats[partyId]) {
        partyStats[partyId] = { party: r.candidate.party, votes: 0, seats: 0 };
      }
      partyStats[partyId].votes += r.votes;
      if (r.status === 'declared') {
        // Logic for seat counting would go here
        // For simplicity, we'll assume the leader in a constituency gets a seat when declared
      }
    });

    res.json({ data: Object.values(partyStats) });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
