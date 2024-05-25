const createUserValidationSchema = {
    username: {
        isLength: {
            options: { min: 5, max: 32},
            errorMessage: "username length must be 5 -32 chars"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        }
    },
    displayName: {
        notEmpty: {
            errorMessage: "DisplayName cannot be empty"
        },
        isString: {
            errorMessage: "displayName must be a string"
        }
    }
};
const updateUserValidationSchema = {
    username: {
        isLength: {
            options: { min: 5, max: 32},
            errorMessage: "username length must be 5 -32 chars"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        }
    },
    displayName: {
        notEmpty: {
            errorMessage: "DisplayName cannot be empty"
        },
        isString: {
            errorMessage: "displayName must be a string"
        }
    }
};

export { createUserValidationSchema };