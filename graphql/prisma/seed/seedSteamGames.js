const { PrismaClient } = require('@prisma/client')

const steam_games = require('./SteamGames.json')

const prisma = new PrismaClient()

const game_prefixes = ['id', 'info']

async function loadGames() {
    const allGames = steam_games['comet'].course
    const cetGames = allGames.filter (
      (game) => game_prefixes.includes(game.prefix._text)
    )
    return cetGames.map((crs) => {
      return {
        info: {
          title: crs.title._text,
          steamAppID: `${crs.prefix._text} ${crs.number._text}`,
          thumb: crs.thumb._text
        }
      }
    })
}

async function main() {
  const allGames = await loadGames()
  for (const crs of allGames) {
      try {
          await prisma.course.create(crs)
      } catch (error) {
          console.log(`Error creating game: ${error}`)
      }
  }
}

main()
  .catch((e) => {
  throw e
  })
  .finally(async () => {
  await prisma.$disconnect()
})