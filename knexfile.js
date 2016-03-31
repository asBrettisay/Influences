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
      database: 'postgres://vjdysfmgsubipq:i2E9ZBoQntmPVJYzwtKyj-Sm_F@ec2-54-204-0-120.compute-1.amazonaws.com:5432/di1dhpnte15e'
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
