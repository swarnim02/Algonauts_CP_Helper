/**
 * Route-param validation for Mongo ObjectIds.
 *
 * Without this, a malformed id reaches Mongoose and throws a CastError, which
 * the controllers' catch blocks report as a 500 — a client mistake shown as a
 * server fault. Registering these as `router.param` handlers rejects bad ids
 * before any controller or database call runs.
 */

// ObjectIds always appear as 24 hex characters in a URL. This is stricter than
// mongoose.Types.ObjectId.isValid, which also accepts any 12-character string.
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

const validateObjectId = (name) => (req, res, next, value) => {
    if (!OBJECT_ID.test(value)) {
        return res.status(400).json({ message: `Invalid ${name}` });
    }
    next();
};

/**
 * Register validators for every id param a router uses.
 * @param {import('express').Router} router
 * @param {...string} names - param names, e.g. 'groupId', 'contestId'
 */
const validateParams = (router, ...names) => {
    names.forEach((name) => router.param(name, validateObjectId(name)));
};

module.exports = { validateObjectId, validateParams, OBJECT_ID };
