import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('yura1234', 10)
  await prisma.user.upsert({
    where: { email: 'docente@miyura.com' },
    update: {},
    create: { email: 'docente@miyura.com', password, fullName: 'Docente Demo' },
  })

  const rows = [
    { fullName: 'Ana Torres', grade: '5A', guardianEmail: 'fam.torres@example.com' },
    { fullName: 'Luis Rivas', grade: '5A', guardianEmail: 'fam.rivas@example.com' },
    { fullName: 'Sofía Vega', grade: '6B', guardianEmail: 'fam.vega@example.com' },
    { fullName: 'Diego Luna', grade: '6B', guardianEmail: 'fam.luna@example.com' },
    { fullName: 'Camila Ruiz', grade: '4A', guardianEmail: 'fam.ruiz@example.com' },
    { fullName: 'Mateo Soto', grade: '4A', guardianEmail: 'fam.soto@example.com' },
  ]
  for (const data of rows) {
    await prisma.student.create({ data })
  }
  console.log('seed: ' + rows.length + ' students + 1 user')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
