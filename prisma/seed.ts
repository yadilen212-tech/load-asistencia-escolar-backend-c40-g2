import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create basic roles
  const roles = [
    { name: 'Docente', description: 'Profesor encargado de la asistencia' },
    { name: 'Administrador', description: 'Administrador del sistema' },
    { name: 'Apoderado', description: 'Apoderado o guardián de estudiantes' },
  ]

  const createdRoles: Record<string, any> = {}
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    })
    createdRoles[roleData.name] = role
    console.log(`✓ Created role: ${roleData.name}`)
  }

  // Create test users with roles
  const password = await bcrypt.hash('yura1234', 10)
  
  const testUsers = [
    {
      email: 'docente@miyura.com',
      fullName: 'Docente Demo',
      roleId: createdRoles['Docente'].id,
    },
    {
      email: 'admin@miyura.com',
      fullName: 'Admin Demo',
      roleId: createdRoles['Administrador'].id,
    },
    {
      email: 'apoderado@miyura.com',
      fullName: 'Apoderado Demo',
      roleId: createdRoles['Apoderado'].id,
    },
  ]

  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: { ...userData, password },
    })
    console.log(`✓ Created user: ${userData.email} (${userData.fullName})`)
  }

  // Create test students
  const students = [
    { fullName: 'Ana Torres', grade: '5A', guardianEmail: 'fam.torres@example.com' },
    { fullName: 'Luis Rivas', grade: '5A', guardianEmail: 'fam.rivas@example.com' },
    { fullName: 'Sofía Vega', grade: '6B', guardianEmail: 'fam.vega@example.com' },
    { fullName: 'Diego Luna', grade: '6B', guardianEmail: 'fam.luna@example.com' },
    { fullName: 'Camila Ruiz', grade: '4A', guardianEmail: 'fam.ruiz@example.com' },
    { fullName: 'Mateo Soto', grade: '4A', guardianEmail: 'fam.soto@example.com' },
  ]

  for (const studentData of students) {
    await prisma.student.create({ data: studentData })
    console.log(`✓ Created student: ${studentData.fullName}`)
  }

  console.log(`\n✅ Seed completed successfully!`)
  console.log(`   - ${roles.length} roles created`)
  console.log(`   - ${testUsers.length} test users created`)
  console.log(`   - ${students.length} test students created`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
