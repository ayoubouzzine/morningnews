export default function (language = 'fr', action) {

    switch (action.type) {
        case 'changeLanguage':
            return action.language;

        default:
            return language;
    }
}; 