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
