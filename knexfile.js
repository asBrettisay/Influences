// Update with your config settings.

module.exports = {

  test: {
    client: 'sqlite3',
    connection: {
      filename: './test/test.sqlite3'
    },
    migrations: {
      directory: __dirname + '/test/test_migrations',
      tableName: 'test_migrations'
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
      database: 'my_db',
      user:     'username',
      password: 'password'
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
