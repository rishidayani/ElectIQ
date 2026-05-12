import { parse } from 'csv-parse';
import prisma from '../prisma';

export interface ColumnMapping {
  constituencyName: string;
  candidateName: string;
  partyName: string;
  votes: string;
  registeredVoters?: string;
  voted?: string;
}

export const ingestCSV = async (
  electionId: string,
  buffer: Buffer,
  mapping: ColumnMapping,
  uploadedBy: string
) => {
  const upload = await prisma.upload.create({
    data: {
      filename: 'upload.csv',
      uploadedBy,
      status: 'processing',
    }
  });

  try {
    const parser = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
    });

    let rowsProcessed = 0;
    const errors: any[] = [];

    for await (const row of parser) {
      try {
        const cName = row[mapping.constituencyName];
        const candName = row[mapping.candidateName];
        const pName = row[mapping.partyName];
        const votes = parseInt(row[mapping.votes]);

        if (!cName || !candName || !pName || isNaN(votes)) {
          errors.push({ row, error: 'Missing or invalid fields' });
          continue;
        }

        // 1. Get or create Party
        const party = await prisma.party.upsert({
          where: { name: pName }, // Note: In a real app, you'd use abbreviation or slug
          update: {},
          create: {
            name: pName,
            abbreviation: pName.substring(0, 3).toUpperCase(),
            colorHex: '#CBD5E1', // Default gray
          }
        });

        // 2. Get or create Constituency
        const constituency = await prisma.constituency.upsert({
          where: { 
            // This is tricky with upsert as we don't have a unique constraint on (electionId, name) in schema yet
            // For now, we'll find first or create
            id: (await prisma.constituency.findFirst({ where: { electionId, name: cName } }))?.id || 'temp-id'
          },
          update: {},
          create: {
            electionId,
            name: cName,
            state: 'Unknown',
            registeredVoters: mapping.registeredVoters ? parseInt(row[mapping.registeredVoters]) || 0 : 0
          }
        });

        // 3. Get or create Candidate
        const candidate = await prisma.candidate.upsert({
          where: {
            id: (await prisma.candidate.findFirst({ where: { name: candName, constituencyId: constituency.id } }))?.id || 'temp-id'
          },
          update: {},
          create: {
            name: candName,
            partyId: party.id,
            constituencyId: constituency.id,
          }
        });

        // 4. Update Result
        await prisma.result.upsert({
          where: {
            id: (await prisma.result.findFirst({ where: { candidateId: candidate.id, constituencyId: constituency.id } }))?.id || 'temp-id'
          },
          update: { votes },
          create: {
            candidateId: candidate.id,
            constituencyId: constituency.id,
            votes,
            status: 'counting'
          }
        });

        rowsProcessed++;
      } catch (err: any) {
        errors.push({ row, error: err.message });
      }
    }

    await prisma.upload.update({
      where: { id: upload.id },
      data: {
        status: 'completed',
        rowsProcessed,
        errors: JSON.stringify(errors)
      }
    });

    return { uploadId: upload.id, rowsProcessed, errors };
  } catch (err: any) {
    await prisma.upload.update({
      where: { id: upload.id },
      data: {
        status: 'failed',
        errors: JSON.stringify([{ error: err.message }])
      }
    });
    throw err;
  }
};
