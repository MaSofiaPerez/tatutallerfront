// Mock data para el UserPanel - Datos que coinciden con las entidades del backend
// Este archivo simula las respuestas del backend basado en ClassEntity y Booking

// Mock user data - lo que devolvería GET /users/profile
export const mockUserData = {
  id: 1,
  firstName: "María",
  lastName: "González",
  email: "maria.gonzalez@email.com",
  phone: "+598 99 123 456",
  address: "Av. 18 de Julio 1234, Apto 5B, Montevideo, Uruguay",
  role: "USER",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-12-01T14:22:00Z"
};

// Mock de instructores
const mockInstructors = {
  1: { id: 1, name: "Ana Rodríguez" },
  2: { id: 2, name: "Carlos Méndez" },
  3: { id: 3, name: "Laura Vega" },
  4: { id: 4, name: "Patricia Silva" },
  5: { id: 5, name: "Hiroshi Tanaka" }
};

// Mock de clases (ClassEntity)
const mockClasses = {
  101: {
    id: 101,
    name: "Introducción a la Cerámica",
    instructor: mockInstructors[1],
    price: 1200
  },
  102: {
    id: 102,
    name: "Técnicas de Esmaltado",
    instructor: mockInstructors[2],
    price: 1800
  },
  103: {
    id: 103,
    name: "Torno de Alfarero - Nivel Intermedio",
    instructor: mockInstructors[1],
    price: 2100
  },
  104: {
    id: 104,
    name: "Escultura en Cerámica",
    instructor: mockInstructors[3],
    price: 1950
  },
  105: {
    id: 105,
    name: "Raku - Técnica Japonesa",
    instructor: mockInstructors[5],
    price: 3500
  }
};

// Mock de reservas (Booking entity) - lo que devolvería GET /bookings o GET /users/{id}/bookings
export const mockUserClasses = [
  {
    id: 1,
    user: { id: 1, firstName: "María", lastName: "González" },
    classEntity: mockClasses[101],
    bookingDate: "2024-12-15",
    startTime: "10:00",
    endTime: "12:00",
    status: "CONFIRMED",
    type: "PUNTUAL",
    notes: "Traer ropa que se pueda ensuciar",
    adminNotes: null,
    createdAt: "2024-11-20T09:15:00Z",
    updatedAt: "2024-11-20T09:15:00Z"
  },
  {
    id: 2,
    user: { id: 1, firstName: "María", lastName: "González" },
    classEntity: mockClasses[102],
    bookingDate: "2024-12-22",
    startTime: "14:00",
    endTime: "17:00",
    status: "PENDING",
    type: "ESPECIAL",
    notes: "Trae tu pieza biscocheada o usa una del taller",
    adminNotes: null,
    createdAt: "2024-12-01T16:30:00Z",
    updatedAt: "2024-12-01T16:30:00Z"
  },
  {
    id: 3,
    user: { id: 1, firstName: "María", lastName: "González" },
    classEntity: mockClasses[103],
    bookingDate: "2025-01-05",
    startTime: "10:00",
    endTime: "13:00",
    status: "CONFIRMED",
    type: "PUNTUAL",
    notes: "Requisito: haber completado nivel básico",
    adminNotes: null,
    createdAt: "2024-12-03T11:45:00Z",
    updatedAt: "2024-12-03T11:45:00Z"
  },
  {
    id: 4,
    user: { id: 1, firstName: "María", lastName: "González" },
    classEntity: mockClasses[104],
    bookingDate: "2024-11-10",
    startTime: "15:00",
    endTime: "18:00",
    status: "CANCELLED",
    type: "PUNTUAL",
    notes: "",
    adminNotes: "Cancelada por problemas de salud del instructor",
    createdAt: "2024-10-25T13:20:00Z",
    updatedAt: "2024-11-08T09:00:00Z"
  }
];

// Mock API functions - simulan las llamadas al backend
export const mockAPI = {
  // Obtener perfil del usuario
  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockUserData };
  },

  // Actualizar perfil del usuario
  updateUserProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (!profileData.email.includes('@')) {
      throw new Error('Email inválido');
    }
    
    return {
      data: {
        success: true,
        message: "Perfil actualizado exitosamente",
        user: { ...mockUserData, ...profileData, updatedAt: new Date().toISOString() }
      }
    };
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (passwordData.currentPassword !== 'password123') {
      throw new Error('Contraseña actual incorrecta');
    }
    
    if (passwordData.newPassword.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }
    
    return {
      data: {
        success: true,
        message: "Contraseña actualizada exitosamente"
      }
    };
  },

  // Obtener clases del usuario
  getUserClasses: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 900));
    return { data: mockUserClasses };
  }
};

// Mock data para la grilla de clases (usado en BookingSystem)
export const mockClassesGrid = [
  {
    id: 1,
    name: "Introducción a la Cerámica",
    instructor: "Ana Rodríguez",
    description: "Aprende los fundamentos básicos de la cerámica",
    duration: 120,
    price: 1200,
    maxParticipants: 8,
    level: "Principiante",
    materials: "Incluidos",
    weekDay: "Lunes",
    startTime: "10:00",
    endTime: "12:00"
  },
  {
    id: 2,
    name: "Técnicas de Esmaltado",
    instructor: "Carlos Méndez",
    description: "Domina diferentes técnicas de esmaltado",
    duration: 180,
    price: 1800,
    maxParticipants: 6,
    level: "Intermedio",
    materials: "Incluidos",
    weekDay: "Martes",
    startTime: "14:00",
    endTime: "17:00"
  },
  {
    id: 3,
    name: "Torno de Alfarero",
    instructor: "Ana Rodríguez",
    description: "Aprende a usar el torno para crear piezas únicas",
    duration: 180,
    price: 2100,
    maxParticipants: 4,
    level: "Intermedio",
    materials: "Incluidos",
    weekDay: "Miércoles",
    startTime: "10:00",
    endTime: "13:00"
  },
  {
    id: 4,
    name: "Escultura en Cerámica",
    instructor: "Laura Vega",
    description: "Crea esculturas usando técnicas de modelado",
    duration: 180,
    price: 1950,
    maxParticipants: 6,
    level: "Intermedio",
    materials: "Incluidos", 
    weekDay: "Jueves",
    startTime: "15:00",
    endTime: "18:00"
  },
  {
    id: 5,
    name: "Raku - Técnica Japonesa",
    instructor: "Hiroshi Tanaka",
    description: "Técnica tradicional japonesa de cocción",
    duration: 240,
    price: 3500,
    maxParticipants: 4,
    level: "Avanzado",
    materials: "Incluidos",
    weekDay: "Viernes",
    startTime: "09:00",
    endTime: "13:00"
  },
  {
    id: 6,
    name: "Cerámica para Niños",
    instructor: "Patricia Silva",
    description: "Taller especial para los más pequeños",
    duration: 90,
    price: 800,
    maxParticipants: 10,
    level: "Principiante",
    materials: "Incluidos",
    weekDay: "Sábado",
    startTime: "10:00",
    endTime: "11:30"
  },
  {
    id: 7,
    name: "Taller Libre",
    instructor: "Ana Rodríguez",
    description: "Espacio para trabajar en proyectos personales",
    duration: 120,
    price: 600,
    maxParticipants: 8,
    level: "Todos los niveles",
    materials: "No incluidos",
    weekDay: "Sábado",
    startTime: "14:00",
    endTime: "16:00"
  }
];
