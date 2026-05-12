import { Request, Response } from 'express';
import prisma from '../prisma';

export const getParties = async (req: Request, res: Response) => {
  try {
    const parties = await prisma.party.findMany();
    res.json({ data: parties });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    const candidates = await prisma.candidate.findMany({
      where: query ? {
        name: { contains: String(query) }
      } : {},
      include: {
        party: true,
        constituency: true
      }
    });
    res.json({ data: candidates });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
