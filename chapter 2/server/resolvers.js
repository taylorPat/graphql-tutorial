export const resolvers = {
    Query: {
        jobs: () => {
            return [
                {
                id: '123456789',
                title: 'The Title',
                description: 'Description',
            },
            {
                id: '3456789',
                title: 'ABC',
                description: 'DEF',
            },
        ]
        },
    },
};