import { connectDB } from '../config/db';
import { Department } from '../models/DepartmentModel';
import { Course } from '../models/CourseModel';
import dotenv from 'dotenv';
dotenv.config();

interface ProgramData {
    code: string;
    name: string;
    duration: string;
    degreeType: string;
    category?: string;
}

interface DepartmentData {
    name: string;
    code: string;
    order: number;
    programs: ProgramData[];
}

const academicData: DepartmentData[] = [
    {
        name: 'College of Arts, Humanities and Social Sciences',
        code: 'CAHSS',
        order: 1,
        programs: [
            { code: 'BFA-ID', name: 'Bachelor of Fine Arts - Industrial Design', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BS DEVCOM', name: 'Bachelor of Science in Development Communication', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BA-FIL', name: 'Batsilyer sa Sining ng Filipino', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'College of Information and Computing Sciences',
        code: 'CISC',
        order: 2,
        programs: [
            { code: 'BS INFOTECH', name: 'Bachelor of Science in Information Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BS INFO SYS', name: 'Bachelor of Science in Information System', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'College of Engineering Technology',
        code: 'CET',
        order: 3,
        programs: [
            { code: 'BINDTECH-COMPTECH', name: 'Bachelor of Industrial Technology major in Computer Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-ET', name: 'Bachelor of Industrial Technology major in Electrical Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-ELEXT', name: 'Bachelor of Industrial Technology major in Electronics Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-MECHANICAL', name: 'Bachelor of Industrial Technology major in Mechanical Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-AT', name: 'Bachelor of Industrial Technology major in Automotive Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-HVAC', name: 'Bachelor of Industrial Technology major in Heating, Ventilating and Air Conditioning Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-CULINARY TECH', name: 'Bachelor of Industrial Technology major in Culinary Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-CONTRUCTION', name: 'Bachelor of Industrial Technology major in Construction Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-AFT', name: 'Bachelor of Industrial Technology major in Apparel and Fashion Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-PPET', name: 'Bachelor of Industrial Technology major in Power Plant Engineering Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-ADT', name: 'Bachelor of Industrial Technology major in Architectural Drafting Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BINDTECH-MECHATRONICS', name: 'Bachelor of Industrial Technology major in Mechatronics Technology', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'College of Teacher Education',
        code: 'CTE',
        order: 4,
        programs: [
            { code: 'BEED', name: 'Bachelor of Elementary Education', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BSED-ENGLISH', name: 'Bachelor of Secondary Education - English', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BSED-MATH', name: 'Bachelor of Secondary Education - Mathematics', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTLED-HE', name: 'Bachelor of Technology Livelihood Education - Home Economics', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTLED-IA', name: 'Bachelor of Technology Livelihood Education - Industrial Arts', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTLED-ICT', name: 'Bachelor of Technology Livelihood Education - Information and Communications Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-AT', name: 'Bachelor of Technical-Vocational Teacher Education - Automotive Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-CCT', name: 'Bachelor of Technical-Vocational Teacher Education - Civil and Construction Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-DT', name: 'Bachelor of Technical-Vocational Teacher Education - Drafting Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-ELECT', name: 'Bachelor of Technical-Vocational Teacher Education - Electrical Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-ELEXT', name: 'Bachelor of Technical-Vocational Teacher Education - Electronics Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-FSM', name: 'Bachelor of Technical-Vocational Teacher Education - Food Service Management', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-GFD', name: 'Bachelor of Technical-Vocational Teacher Education - Garments, Fashion and Design', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-MT', name: 'Bachelor of Technical-Vocational Teacher Education - Mechanical Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-WAFT', name: 'Bachelor of Technical-Vocational Teacher Education - Welding and Fabrication Technology', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BTVTED-HVAC', name: 'Bachelor of Technical-Vocational Teacher Education - Heating, Ventilating and Air-Conditioning Technology', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'College of Maritime Education',
        code: 'CME',
        order: 5,
        programs: [
            { code: 'BS MAR-E', name: 'Bachelor of Science in Marine Engineering', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'College of Physical Education and Sports',
        code: 'CPES',
        order: 6,
        programs: [
            { code: 'BPED', name: 'Bachelor of Physical Education', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BSESS-FSC', name: 'Bachelor of Science in Exercise and Sports Sciences major in Fitness and Sports Coaching', duration: '4 Years', degreeType: 'Bachelor' },
            { code: 'BSESS-FSM', name: 'Bachelor of Science in Exercise and Sports Sciences major in Fitness and Sports Management', duration: '4 Years', degreeType: 'Bachelor' }
        ]
    },
    {
        name: 'School of Business Administration',
        code: 'SBA',
        order: 7,
        programs: [
            { code: 'BSHM', name: 'Bachelor of Science in Hospitality Management', duration: '3 Years', degreeType: 'Diploma' },
            { code: 'BS ENTREP', name: 'Bachelor of Science in Entrepreneurship', duration: '3 Years', degreeType: 'Diploma' }
        ]
    },
    {
        name: 'Institute of Technical Education',
        code: 'ITE',
        order: 8,
        programs: [
            // Three-Year Diploma Programs
            { code: 'DT-AET', name: 'Automotive Engineering Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-IT', name: 'Information Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-EET', name: 'Electrical Engineering Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-ECT', name: 'Electronics and Communication Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-HMT', name: 'Hospitality Management Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-CET', name: 'Civil Engineering Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-FPSMT', name: 'Food Production and Services Management Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-MET', name: 'Mechanical Engineering Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'DT-GFDT', name: 'Garments, Fashion and Design Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            { code: 'TITE-WAFT', name: 'Trade Industrial Technical Education - Welding and Fabrication Technology', duration: '3 Years', degreeType: 'Diploma', category: 'Three-Year Diploma Programs' },
            // Two-Year Associate Programs
            { code: 'AIT-AUTO', name: 'Two-Year Associate in Industrial Technology - Automotive Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'AIT-FOOD', name: 'Two-Year Associate in Industrial Technology - Food Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'AIT-GTT', name: 'Two-Year Associate in Industrial Technology - Garments Textile and Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'AIT-ELEXT', name: 'Two-Year Associate in Industrial Technology - Electronics Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'AIT-ELECT', name: 'Two-Year Associate in Industrial Technology - Electrical Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'AIT-RACT', name: 'Two-Year Associate in Industrial Technology - Refrigeration and Air Conditioning Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            { code: 'TTEC-ADT', name: 'Two-Year Associate in Industrial Technology - Architectural Drafting Technology', duration: '2 Years', degreeType: 'Associate', category: 'Two-Year Associate Programs' },
            // Two-Year Certificate Programs
            { code: 'CHS', name: 'Certificate in Computer Hardware Servicing', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'EIM', name: 'Certificate in Electrical Installation and Maintenance', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'PLUMBING', name: 'Certificate in Plumbing', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'AUTO-SVC', name: 'Certificate in Automotive Servicing', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'WELD-FAB', name: 'Certificate in Welding and Fabrication', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'FBS', name: 'Certificate in Food and Beverage Services', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'HSK', name: 'Certificate in Housekeeping', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'COOKERY', name: 'Certificate in Cookery', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'DRESSMAKING', name: 'Certificate in Dressmaking', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' },
            { code: 'COSMETOLOGY', name: 'Certificate in Cosmetology', duration: '2 Years', degreeType: 'Certificate', category: 'Two-Year Certificate Programs' }
        ]
    }
];

export const seedAcademic = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();

        console.log('Seeding Academic Departments and Courses...');
        let totalDepartments = 0;
        let totalCourses = 0;

        for (const deptData of academicData) {
            // Upsert Department
            const dept = await Department.findOneAndUpdate(
                { code: deptData.code },
                {
                    name: deptData.name,
                    code: deptData.code,
                    order: deptData.order,
                    isActive: true
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            totalDepartments++;
            console.log(`✓ Department: [${dept.code}] ${dept.name}`);

            // Upsert Courses for this Department
            let courseIndex = 1;
            for (const prog of deptData.programs) {
                await Course.findOneAndUpdate(
                    { code: prog.code },
                    {
                        department: dept._id,
                        departmentCode: dept.code,
                        code: prog.code,
                        name: prog.name,
                        duration: prog.duration,
                        degreeType: prog.degreeType,
                        category: prog.category || '',
                        order: courseIndex++,
                        isActive: true
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                totalCourses++;
            }
            console.log(`  └─ Seeded ${deptData.programs.length} courses for ${dept.code}`);
        }

        console.log(`\nAcademic seeding completed successfully!`);
        console.log(`Total Departments: ${totalDepartments}`);
        console.log(`Total Courses/Programs: ${totalCourses}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding academic data:', error);
        process.exit(1);
    }
};

seedAcademic();
