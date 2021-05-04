const mockHistoryArray: string[] = [];

const reactRouterDom = jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: mockHistoryArray[mockHistoryArray.length - 1],
    }),
    useHistory: () => mockHistoryArray,
    __setHistory: (history: string[]): string[] => {
        while (mockHistoryArray.length > 0) {
            mockHistoryArray.pop();
        }
        mockHistoryArray.push(...history);
        return mockHistoryArray;
    },
}));

export default reactRouterDom;
