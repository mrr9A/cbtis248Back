import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CargaMasivaService } from './carga-masiva.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';

@Controller('carga-masiva')
export class CargaMasivaController {
    constructor(private readonly cargaMasivaService: CargaMasivaService) {}

    @Post('subir')
    @UseInterceptors(FileInterceptor('file'))
    async cargarArchivo(@UploadedFile() file: Express.Multer.File): Promise<string> {
        // Leer el archivo Excel
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });

        // Definir el orden de las hojas y sus métodos en el servicio
        const hojas = {
            Roles: 'cargarRoles',
            Grupos: 'cargarGrupos',
            Administrativos: 'cargarAdministrativos',
            Alumnos: 'cargarAlumnos',
            Responsables: 'cargarResponsables',
            Alumno_Responsable: 'cargarAlumnoResponsable', // Hoja para relaciones
            Usuarios: 'cargarUsuarios',
            Tipo_Incidencias: 'cargarTiposIncidencias',
        };

        const ordenDeHojas = [
            'Roles',               // Primero se crean los roles
            'Grupos',              // Luego los grupos
            'Administrativos',     // Posteriormente los administrativos
            'Alumnos',             // Después los alumnos con su grupoId
            'Responsables',        // Responsables después de los alumnos
            'Alumno_Responsable',  // Relaciones entre alumnos y responsables
            'Usuarios',            // Usuarios después de responsables y administrativos
            'Tipo_Incidencias',    // Finalmente los tipos de incidencia
        ];

        // Procesar las hojas en el orden correcto
        for (const hoja of ordenDeHojas) {
            const metodo = hojas[hoja]; // Obtener el método del servicio
            const datos = workbook.Sheets[hoja] 
                ? xlsx.utils.sheet_to_json(workbook.Sheets[hoja]) 
                : [];

            if (datos.length && metodo) {
                console.log(`Procesando hoja: ${hoja}`); // Log para seguimiento
                await this.cargaMasivaService[metodo](datos);
            }
        }

        return 'Carga masiva realizada con éxito';
    }
}
