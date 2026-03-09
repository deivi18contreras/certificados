import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contratista from './src/models/Contratista.js';
import Reporte from './src/models/Reporte.js';
import dbConnect from './src/config/dataBase.js';

dotenv.config();

const verifyData = async () => {
    try {
        await dbConnect();
        console.log('🔍 Verificando datos actuales en la DB...\n');

        const contratistas = await Contratista.find({});
        console.log(`📋 Total Contratistas: ${contratistas.length}`);
        contratistas.forEach(c => console.log(` - ${c.nombres} ${c.apellidos} (${c.numeroDocumento})`));

        console.log('\n');

        const reportes = await Reporte.find({}).populate('contratista');
        console.log(`📄 Total Reportes: ${reportes.length}`);
        reportes.forEach(r => {
            if (r.contratista) {
                console.log(` - [${r.operadorPago}] Planilla: ${r.datosOperador?.get('numeroPlanilla') || 'N/A'} | Contratista: ${r.contratista.nombres}`);
            } else {
                console.log(` - [${r.operadorPago}] Reporte sin contratista asociado (${r._id})`);
            }
        });

        console.log('\n✅ Verificación terminada.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyData();
