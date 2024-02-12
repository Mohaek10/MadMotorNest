db.createUser({
  user: 'admin',
  pwd: '12345',
  roles: [
    {
      role: 'readWrite',
      db: 'madmotor',
    },
  ],
})

db = db.getSiblingDB('madmotor')

db.createCollection('pedidos')
db.pedidos.insertMany([
  {
    _id: ObjectId('65c9d7bff399d297367a31ba'),
    idUsuario: 1,
    cliente: {
      nombre: 'moha',
      apellido: 'ek',
      telefono: '1234555',
      direccion: {
        calle: 'postas',
        numero: '34',
        ciudad: 'Madrid',
        provinica: 'Madrid',
        pais: 'España',
        codigoPostal: '28432',
      },
    },
    lineasDePedido: [
      {
        cantidadVehiculo: 2,
        idVehiculo: '1',
        precioVehiculo: 1999998,
        total: 999999,
        precioTotal: 1999998,
      },
      {
        idPieza: 'a894b317-5ca2-4952-8417-856774001b71',
        cantidadPieza: 7,
        precioPieza: 10.5,
        total: 3,
        precioTotal: 10.5,
      },
    ],
    totalPedido: 2000008.5,
    isDeleted: false,
    createdAt: { $date: '2024-02-12T08:33:03.477Z' },
    updatedAt: { $date: '2024-02-12T08:33:03.477Z' },
  },
])
