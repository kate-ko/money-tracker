const Sequelize = require('sequelize');
const sequelize = require('../dataAccess/da');
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    name: {
        type: Sequelize.STRING,
        notNull: true
    },
    password: {
        type: Sequelize.STRING,
        notNull: true
    },
    limitation: {
        type: Sequelize.INTEGER
    }
},
    {
        timestamps: false
    });
const Record = sequelize.define('record', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    userid: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    date: {
        type: Sequelize.STRING,
        notNull: true
    },
    type: {
        type: Sequelize.STRING,
        notNull: true
    },
    categoryid: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    paymentmethodid: {
        type: Sequelize.SMALLINT,
        notNull: true
    },
    amount: {
        type: Sequelize.INTEGER,
        notNull: true
    },
    currency: {
        type: Sequelize.STRING,
        notNull: true
    },
    comment: {
        type: Sequelize.STRING
    },
},
    {
        timestamps: false
    });

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    name: {
        type: Sequelize.STRING,
        notNull: true
    },
    type: {
        type: Sequelize.INTEGER,
        notNull: true
    }
},
    {
        timestamps: false
    });
const PaymentMethod = sequelize.define('paymentmethod', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    name: {
        type: Sequelize.STRING,
        notNull: true
    }
},
    {
        timestamps: false
    });
   
User.hasMany(Record, { foreignKey: 'userid', sourceKey: 'id', as: "record" });
Category.hasMany(Record, { foreignKey: 'categoryid', sourceKey: 'id' });
// Record.hasOne(Category, { foreignKey: 'id', sourceKey: 'categoryId' })
Record.belongsTo(Category, { foreignKey: 'categoryid', sourceKey: 'id',as: "category"})

PaymentMethod.hasMany(Record, { foreignKey: 'paymentmethodid', sourceKey: 'id' });
// Record.hasOne(PaymentMethod, { foreignKey: 'id', sourceKey: 'paymentMethodId' })
Record.belongsTo(PaymentMethod, { foreignKey: 'paymentmethodid', sourceKey: 'id',as: "paymentMethod" })

module.exports = { User: User, Record: Record, Category: Category, PaymentMethod: PaymentMethod };

