import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Create an analyst user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@electiq.com' },
    update: {},
    create: {
      email: 'admin@electiq.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'analyst',
    },
  });

  // Parties
  const parties = [
    { name: 'Bharatiya Janata Party', abbreviation: 'BJP', colorHex: '#FF9933' },
    { name: 'All India Trinamool Congress', abbreviation: 'AITC', colorHex: '#20C646' },
    { name: 'Indian National Congress', abbreviation: 'INC', colorHex: '#19AAED' },
    { name: 'Aam Aadmi Party', abbreviation: 'AAP', colorHex: '#0072B0' },
    { name: 'Communist Party of India (Marxist)', abbreviation: 'CPIM', colorHex: '#DE0000' },
  ];

  const partyMap: Record<string, any> = {};
  for (const p of parties) {
    partyMap[p.abbreviation] = await prisma.party.upsert({
      where: { id: p.abbreviation }, // Using abbreviation as ID for simplicity in mapping
      update: p,
      create: { id: p.abbreviation, ...p },
    });
  }

  // Elections
  const gujarat2022 = await prisma.election.create({
    data: {
      name: 'Gujarat Assembly Election 2022',
      date: new Date('2022-12-01'),
      totalSeats: 182,
      status: 'completed',
    },
  });

  const bengal2021 = await prisma.election.create({
    data: {
      name: 'West Bengal Assembly Election 2021',
      date: new Date('2021-03-27'),
      totalSeats: 294,
      status: 'completed',
    },
  });

  // Constituencies & Candidates - Gujarat
  const gujaratData = [
    {
      name: 'Ghatlodia',
      state: 'Gujarat',
      voters: 350000,
      candidates: [
        { name: 'Bhupendra Patel', party: 'BJP', votes: 192000, photo: '/images/male_leader.png' },
        { name: 'Amiben Yagnik', party: 'INC', votes: 21000, photo: '/images/female_leader.png' },
      ]
    },
    {
      name: 'Viramgam',
      state: 'Gujarat',
      voters: 280000,
      candidates: [
        { name: 'Hardik Patel', party: 'BJP', votes: 99155, photo: '/images/male_leader.png' },
        { name: 'Bharwad Lakhabhai', party: 'INC', votes: 47448, photo: '/images/male_leader.png' },
      ]
    }
  ];

  // Constituencies & Candidates - Bengal
  const bengalData = [
    {
      name: 'Nandigram',
      state: 'West Bengal',
      voters: 250000,
      candidates: [
        { name: 'Suvendu Adhikari', party: 'BJP', votes: 110764, photo: '/images/male_leader.png' },
        { name: 'Mamata Banerjee', party: 'AITC', votes: 108808, photo: '/images/female_leader.png' },
      ]
    },
    {
      name: 'Bhabanipur',
      state: 'West Bengal',
      voters: 210000,
      candidates: [
        { name: 'Mamata Banerjee', party: 'AITC', votes: 85263, photo: '/images/female_leader.png' },
        { name: 'Priyanka Tibrewal', party: 'BJP', votes: 26428, photo: '/images/female_leader.png' },
      ]
    }
  ];

  async function seedStateData(election: any, data: any[]) {
    for (const c of data) {
      const constituency = await prisma.constituency.create({
        data: {
          electionId: election.id,
          name: c.name,
          state: c.state,
          registeredVoters: c.voters,
        }
      });

      let totalVoted = 0;
      for (const cand of c.candidates) {
        const candidate = await prisma.candidate.create({
          data: {
            name: cand.name,
            partyId: partyMap[cand.party].id,
            constituencyId: constituency.id,
            photoUrl: cand.photo || null,
          }
        });

        await prisma.result.create({
          data: {
            candidateId: candidate.id,
            constituencyId: constituency.id,
            votes: cand.votes,
            status: 'declared',
          }
        });
        totalVoted += cand.votes;
      }

      await prisma.turnout.create({
        data: {
          constituencyId: constituency.id,
          registered: c.voters,
          voted: totalVoted + 5000, // Some buffer for others
          percentage: ((totalVoted + 5000) / c.voters) * 100,
        }
      });
    }
  }

  await seedStateData(gujarat2022, gujaratData);
  await seedStateData(bengal2021, bengalData);

  // Historical Results (for trends)
  await prisma.historicalResult.createMany({
    data: [
      { electionId: gujarat2022.id, constituencyId: (await prisma.constituency.findFirst({ where: { name: 'Ghatlodia' } }))!.id, electionYear: 2017, candidateName: 'Bhupendra Patel', partyName: 'BJP', votes: 117000 },
      { electionId: bengal2021.id, constituencyId: (await prisma.constituency.findFirst({ where: { name: 'Nandigram' } }))!.id, electionYear: 2016, candidateName: 'Suvendu Adhikari', partyName: 'AITC', votes: 134000 },
    ]
  });

  // Alert Rules & History
  const rule = await prisma.alertRule.create({
    data: {
      userId: user.id,
      conditionType: 'seat_flip',
      active: true,
    }
  });

  await prisma.alertHistory.create({
    data: {
      ruleId: rule.id,
      message: 'Nandigram seat flipped from AITC to BJP',
      severity: 'critical',
    }
  });

  console.log('Seed data updated with Gujarat & Bengal records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
