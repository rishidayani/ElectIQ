import { Request, Response } from 'express';
import prisma from '../prisma';

export const getConstituencies = async (req: Request, res: Response) => {
  const { electionId } = req.query;
  try {
    const constituencies = await prisma.constituency.findMany({
      where: electionId ? { electionId: String(electionId) } : {},
      include: { turnout: true }
    });
    res.json({ data: constituencies });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getConstituencyDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const constituency = await prisma.constituency.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            party: true,
            results: {
              where: { constituencyId: id }
            }
          }
        },
        turnout: true,
        historicalResults: true
      }
    });
    if (!constituency) {
      return res.status(404).json({ error: 'Constituency not found' });
    }
    res.json({ data: constituency });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
