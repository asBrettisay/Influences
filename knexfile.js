// Update with your config settings.

module.exports = {

  test: {
    client: 'sqlite3',
    connection: {
      filename: './test/test.sqlite3'
    },
    migrations: {
      directory: __dirname + '/migrations',
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  development: {
    client: 'postgresql',
    connection: {
      database: 'influences',
      user: 'postgres'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'di1dhpnte15e',
      host: 'ec2-54-204-0-120.compute-1.amazonaws.com',
      port: '5432',
      user: 'vjdysfmgsubipq',
      password: 'i2E9ZBoQntmPVJYzwtKyj-Sm_F'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
