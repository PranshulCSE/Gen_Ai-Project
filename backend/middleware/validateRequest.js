const validateRequest = (fields = [], source = "body") => {
    return (req, res, next) => {
        const target = req[source] || {};
        const missingFields = fields.filter((field) => {
            const value = target[field];
            return value === undefined || value === null || String(value).trim() === "";
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
        }

        next();
    };
};

module.exports = validateRequest; 