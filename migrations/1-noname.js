'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 * createTable "Courses", deps: [Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2022-08-10T17:17:21.023Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "firstName": {
                    "type": Sequelize.STRING,
                    "field": "firstName",
                    "validate": {
                        "notNull": {
                            "msg": "Please enter title"
                        },
                        "notEmpty": {
                            "msg": "Please provide a title"
                        }
                    },
                    "allowNull": false
                },
                "lastName": {
                    "type": Sequelize.STRING,
                    "field": "lastName",
                    "validate": {
                        "notNull": {
                            "msg": "Please enter title"
                        },
                        "notEmpty": {
                            "msg": "Please provide a title"
                        }
                    },
                    "allowNull": false
                },
                "emailAddress": {
                    "type": Sequelize.STRING,
                    "field": "emailAddress",
                    "validate": {
                        "notNull": {
                            "msg": "Please enter title"
                        },
                        "notEmpty": {
                            "msg": "Please provide a title"
                        }
                    },
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "validate": {
                        "notNull": {
                            "msg": "Please enter title"
                        },
                        "notEmpty": {
                            "msg": "Please provide a title"
                        }
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Courses",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING,
                    "field": "title",
                    "validate": {
                        "notNull": {
                            "msg": "Please enter title"
                        },
                        "notEmpty": {
                            "msg": "Please provide a title"
                        }
                    },
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "validate": {
                        "notNull": {
                            "msg": "Please add description"
                        },
                        "notEmpty": {
                            "msg": "Please provide a description"
                        }
                    },
                    "allowNull": false
                },
                "estimatedTime": {
                    "type": Sequelize.STRING,
                    "field": "estimatedTime"
                },
                "materialsNeeded": {
                    "type": Sequelize.STRING,
                    "field": "materialsNeeded"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "field": "userId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
