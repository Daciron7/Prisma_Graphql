const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const gamerData = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    game: {
      create: [
        {
          title: 'Company of Heroes',
          steamAppID: '4560',
          thumb: 'https:\/\/cdn.cloudflare.steamstatic.com\/steam\/apps\/228200\/capsule_sm_120.jpg?t=1603127288'
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    game: {
      create: [
        {
          title: 'Take On Helicopters',
          steamAppID: '65730',
          thumb: 'https:\/\/cdn.cloudflare.steamstatic.com\/steam\/apps\/65730\/capsule_sm_120.jpg?t=1593518800'
        },
      ],
    },
  },
  {
    name: 'Buddy',
    email: 'buddy@prisma.io',
    game: {
      create: [
        {
          title: 'PT Boats: South Gambit',
          steamAppID: '10260',
          thumb: 'https:\/\/cdn.cloudflare.steamstatic.com\/steam\/apps\/10260\/capsule_sm_120.jpg?t=1447354640'
        },
        {
          title: 'Sid Meiers Civilization IV',
          steamAppID: '3900',
          thumb: 'https:\/\/cdn.cloudflare.steamstatic.com\/steam\/apps\/3900\/capsule_sm_120.jpg?t=1573063101',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const i of gamerData) {
    const gameUser = await prisma.user.create({
      data: i,
    })
    console.log(`Created gameUser with id: ${gameUser.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })