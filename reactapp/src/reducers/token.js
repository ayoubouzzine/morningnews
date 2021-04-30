export default function (token = '', action) {

    switch (action.type) {
        case 'addToken':
            return action.token;

        default:
            return token;
    };
};