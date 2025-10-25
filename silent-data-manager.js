// Silent data manager - prevents data-related errors
(function() {
    if (!window.dataManager) {
        window.dataManager = {
            getCountries: () => [],
            getAllTours: () => [],
            getData: () => ({}),
            getContacts: () => ({}),
            getSettings: () => ({})
        };
    }
})();
