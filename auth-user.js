'use strict';

const auth = require('basic-auth');
const { Users } = require('./models')
const bcrypt = require('bcrypt');

exports.authenticateUser = async (req, res, next) => {
    let message;
    try {
        const credentials = auth(req);

        if(credentials) {
            const user = await Users.findOne({ where: {emailAddress: credentials.name} })
            if(user) {
                    const authenticated = bcrypt
                    .compareSync(credentials.pass, user.password);
                if(authenticated) {
                    console.log(`Authentication Successful for username: ${credentials.name}`)
                
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for username ${credentials.name}`;
                }
            } else {
                message = `User not found for username: ${credentials.name}`
            }
        } else {
            message = 'Auth header not found'
        }

        if(message) {
            console.warn(message);
            res.status(401).json( { message: 'Access Denied'} )
        } else {
            next();
        }
    } catch (err) {
        res.json({error: err.message + 'catch error'})
    }
}