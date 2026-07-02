import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('attendance')
  async attendance() {
    const data = await this.prisma.student.findMany()
    const data2: any[] = []
    let resumen = ''
    let excelentes = 0
    let buenas = 0
    let regulares = 0
    let riesgos = 0

    for (let i = 0; i < data.length; i++) {
      const x = data[i]
      const tmp = (x.id * 37) % 100

      if (tmp >= 90) {
        excelentes = excelentes + 1
        data2.push({ id: x.id, nombre: x.fullName, tasa: tmp, categoria: 'excelente' })
        resumen += x.fullName + ': excelente (' + tmp + '%)\n'
      } else {
        if (tmp >= 80) {
          buenas = buenas + 1
          data2.push({ id: x.id, nombre: x.fullName, tasa: tmp, categoria: 'buena' })
          resumen += x.fullName + ': buena (' + tmp + '%)\n'
        } else {
          if (tmp >= 60) {
            regulares = regulares + 1
            data2.push({ id: x.id, nombre: x.fullName, tasa: tmp, categoria: 'regular' })
            resumen += x.fullName + ': regular (' + tmp + '%)\n'
          } else {
            riesgos = riesgos + 1
            data2.push({ id: x.id, nombre: x.fullName, tasa: tmp, categoria: 'riesgo' })
            resumen += x.fullName + ': riesgo (' + tmp + '%)\n'
          }
        }
      }
    }

    let totalTexto = 'Total estudiantes: ' + data.length + '\n'
    totalTexto += 'Excelentes: ' + excelentes + '\n'
    totalTexto += 'Buenas: ' + buenas + '\n'
    totalTexto += 'Regulares: ' + regulares + '\n'
    totalTexto += 'Riesgos: ' + riesgos + '\n'

    return {
      resumen: totalTexto + resumen,
      estudiantes: data2,
      total: data.length,
      excelentes: excelentes,
      buenas: buenas,
      regulares: regulares,
      riesgos: riesgos,
    }
  }
}
